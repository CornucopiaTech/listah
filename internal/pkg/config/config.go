package config

import (
	"fmt"
	"log"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type webConfig struct {
	Host    string
	Port    string
	Address string
}
type apiConfig struct {
	Host    string
	Port    string
	Address string
}

type mongoDBConfig struct {
	Host             string
	DatabaseName     string
	Port             string
	User             string
	Password         string
	Address          string
	TimeoutDuration  time.Duration
	UseSSL           bool
	MaxPoolSize      string
	AuthCredentials  options.Credential
	ConnectionString string
}

type pgsqlDBConfig struct {
	Host         string
	DatabaseName string
	Port         string
	User         string
	Password     string
	Address      string
}

type instrumentationConfig struct {
	OtelExporterEndpoint string
	TraceFreqSec         int
	MetricFreqSec        int
	OltpExporterType     string
}

type Config struct {
	AppName         string
	Env             string
	ProjectRoot     string
	Api             *apiConfig
	Web             *webConfig
	PgsqlDB         *pgsqlDBConfig
	MongoDB         *mongoDBConfig
	Instrumentation *instrumentationConfig
}

func Init() (*Config, error) {
	appName := os.Getenv("APP_NAME")
	log.Printf("Name of app: %s", appName)
	if appName == "" {
		log.Fatalf("environmental variable: APP_NAME not set")
	}
	a := loadApi()
	w := loadWeb()
	d := loadPgsqlDatabase()
	t := loadInstrumentation()

	return &Config{
		// AppName:         fmt.Sprintf("%s-api", appName),
		AppName:         appName,
		Env:             loadEnv(),
		ProjectRoot:     loadProjectRoot(),
		Api:             a,
		Web:             w,
		PgsqlDB:         d,
		Instrumentation: t,
	}, nil

}

func mustMapEnv(target *string, envKey string) {
	v := os.Getenv(envKey)
	if v == "" {
		panic(fmt.Sprintf("environment variable %q not set", envKey))
	}
	*target = v
}

func loadEnv() string {
	var env string
	if os.Getenv("ENV") != "" {
		env = os.Getenv("ENV")
	} else {
		env = "PROD"
	}
	fmt.Printf("Environment is: %v\n", env)
	return env
}

func loadProjectRoot() string {
	fileAbsPath, err := filepath.Abs("../../")
	if err != nil {
		log.Fatalf("could not load project root")
	}
	return fileAbsPath
}

func loadApi() *apiConfig {
	var ah string
	mustMapEnv(&ah, "API_HOST")

	var ap string
	mustMapEnv(&ap, "API_PORT")

	return &apiConfig{
		Host:    ah,
		Port:    ap,
		Address: net.JoinHostPort(ah, ap),
	}
}

func loadWeb() *webConfig {
	var ah string
	mustMapEnv(&ah, "APP_HOST")

	var ap string
	mustMapEnv(&ap, "APP_PORT")

	return &webConfig{
		Host:    ah,
		Port:    ap,
		Address: net.JoinHostPort(ah, ap),
	}
}

func loadMongoDatabase() *mongoDBConfig {
	// This parses through environmental variables and env file to get
	//    database config.
	// Connection string format: mongodb://username:password@host:port/databaseName?ssl=false&connectTimeoutMS=5000&maxPoolSize=50

	// Get database host in environmental variables
	var dh string
	mustMapEnv(&dh, "DATABASE_HOST")

	// Get database port in environmental variables
	var dp string
	mustMapEnv(&dp, "DATABASE_PORT")

	// Get database name in environmental variables
	var dn string
	mustMapEnv(&dn, "DATABASE_NAME")

	// Get database timeout in environmental variables
	var dtd_s string
	mustMapEnv(&dtd_s, "DATABASE_TIMEOUT_MILLISECONDS")
	dtd, err := strconv.Atoi(dtd_s)
	if err != nil {
		log.Fatalf("environmental variable: DATABASE_TIMEOUT_MILLISECONDS incorrect")
	}
	dbtd := time.Duration(dtd) * time.Millisecond

	// Get database use SSL in environmental variables
	var dssl_s string
	mustMapEnv(&dssl_s, "DATABASE_USE_SSL")
	dssl, err := strconv.ParseBool(dssl_s)
	if err != nil {
		log.Fatalf("environmental variable: DATABASE_USE_SSL incorrect")
	}

	// Get database max pool size in environmental variables
	var dmp string
	mustMapEnv(&dmp, "DATABASE_MAX_POOL_SIZE")

	// Get database address
	add := net.JoinHostPort(dh, dp)

	// Get database connection string
	conn := fmt.Sprintf("mongodb://%v/%v", add, dn)

	// Get database auth mechanism in environmental variables
	var dauth string
	mustMapEnv(&dauth, "DATABASE_AUTH_MECHANISM")

	// Get database credentials
	var cred options.Credential
	if dauth == "MONGODB-OIDC" {

		// Get database OIDC environment in environmental variables
		var oidc string
		mustMapEnv(&oidc, "DATABASE_OIDC_ENVIRONMENT")

		// Get database token resource in environmental variables
		var tkn string
		mustMapEnv(&tkn, "DATABASE_OIDC_TOKEN_RESOURCE")

		props := map[string]string{
			"ENVIRONMENT":    oidc,
			"TOKEN_RESOURCE": tkn,
		}

		cred = options.Credential{
			AuthMechanism:           dauth,
			AuthMechanismProperties: props,
		}
	} else {

		var usr string
		mustMapEnv(&usr, "DATABASE_USERNAME")

		// Get database password in environmental variables
		var pwd string
		mustMapEnv(&pwd, "DATABASE_PASSWORD")

		// Get database username and password in environmental variables
		upReq := dauth == "SCRAM" || dauth == "PLAIN" || dauth == "MONGODB-AWS"

		if upReq && dauth != "SCRAM" {
			cred = options.Credential{
				AuthMechanism: dauth,
				Username:      usr,
				Password:      pwd,
			}
		} else if dauth == "SCRAM" {
			var authsrc string
			mustMapEnv(&authsrc, "DATABASE_AUTHSOURCE")

			cred = options.Credential{
				Username:   usr,
				Password:   pwd,
				AuthSource: authsrc,
			}
		}

	}

	fmt.Printf("Db connection string is %v \n", conn)

	return &mongoDBConfig{
		Host:             dh,
		Port:             dp,
		DatabaseName:     dn,
		Address:          add,
		TimeoutDuration:  dbtd,
		UseSSL:           dssl,
		MaxPoolSize:      dmp,
		AuthCredentials:  cred,
		ConnectionString: conn,
	}
}

func loadPgsqlDatabase() *pgsqlDBConfig {
	// Get database host in environmental variables
	var dh string
	mustMapEnv(&dh, "DATABASE_HOST")

	// Get database port in environmental variables
	var dp string
	mustMapEnv(&dp, "DATABASE_PORT")

	// Get database name in environmental variables
	var dn string
	mustMapEnv(&dn, "POSTGRES_DB")

	var usr string
	mustMapEnv(&usr, "POSTGRES_USER")

	// Get database password in environmental variables
	var pwd string
	mustMapEnv(&pwd, "POSTGRES_PASSWORD")

	return &pgsqlDBConfig{
		Host:         dh,
		Port:         dp,
		User:         usr,
		Password:     pwd,
		DatabaseName: dn,
		Address:      net.JoinHostPort(dh, dp),
	}
}

func loadInstrumentation() *instrumentationConfig {
	var otel_n string
	mustMapEnv(&otel_n, "OTEL_EXPORTER_OTLP_ENDPOINT")

	var ot string
	mustMapEnv(&ot, "OLTP_EXPORTER_TYPE")

	var tf_str string
	mustMapEnv(&tf_str, "TRACE_FREQ_SEC")

	tf, err := strconv.Atoi(tf_str)
	if err != nil || tf == 0 {
		log.Fatalf("environment variable: TRACE_FREQ_SEC incorrect")
	}

	var mf_str string
	mustMapEnv(&mf_str, "METRIC_FREQ_SEC")

	mf, err := strconv.Atoi(mf_str)
	if err != nil || mf == 0 {
		log.Fatalf("environment variable: METRIC_FREQ_SEC incorrect")
	}

	return &instrumentationConfig{
		OtelExporterEndpoint: otel_n,
		TraceFreqSec:         tf,
		MetricFreqSec:        mf,
		OltpExporterType:     ot,
	}
}
