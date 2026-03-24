package config

import (
	"fmt"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"log"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

type appNetworkConfig struct {
	Address        string
	AllowedOrigins string
}

type pgsqlDBConfig struct {
	Host         string
	DatabaseName string
	Port         string
	User         string
	Password     string
	Address      string
}

type mongoDBConfig struct {
	AuthCredentials  options.Credential
	Host             string
	DatabaseName     string
	Port             string
	User             string
	Password         string
	Address          string
	MaxPoolSize      string
	ConnectionString string
	TimeoutDuration  time.Duration
	UseSSL           bool
}

type instrumentationConfig struct {
	OtelExporterEndpoint string
	OltpExporterType     string
	TraceFreqSec         int
	MetricFreqSec        int
}

type Config struct {
	Api             *appNetworkConfig
	PgsqlDB         *pgsqlDBConfig
	MongoDB         *mongoDBConfig
	Instrumentation *instrumentationConfig
	AppName         string
	Env             string
	ProjectRoot     string
}

func Init() (*Config, error) {
	var appName string
	mustMapEnv(&appName, "APP_NAME")

	a := loadApi()
	d := loadPgsqlDatabase()
	t := loadInstrumentation()
	m := loadMongoDatabase()

	return &Config{
		AppName:         fmt.Sprintf("%s-api", appName),
		Env:             loadEnv(),
		ProjectRoot:     loadProjectRoot(),
		Api:             a,
		PgsqlDB:         d,
		MongoDB:         m,
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
	fileAbsPath, err := filepath.Abs("./")
	if err != nil {
		log.Fatalf("could not load project root")
	}
	return fileAbsPath
}

func loadApi() *appNetworkConfig {
	var ap string
	mustMapEnv(&ap, "PORT")

	var ao string
	mustMapEnv(&ao, "ALLOWED_ORIGINS")

	return &appNetworkConfig{
		Address:        net.JoinHostPort("0.0.0.0", ap),
		AllowedOrigins: ao,
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

func loadMongoDatabase() *mongoDBConfig {
	// This parses through environmental variables and env file to get
	//    database config.
	// Connection string format: mongodb://username:password@host:port/databaseName?ssl=false&connectTimeoutMS=5000&maxPoolSize=50

	// Get database host in environmental variables
	dbHost := os.Getenv("MONGO_DATABASE_HOST")
	if dbHost == "" {
		log.Fatalf("environmental variable for database host is not set")
	}

	// Get database port in environmental variables
	dbPort := os.Getenv("MONGO_DATABASE_PORT")
	if dbPort == "" {
		log.Fatalf("environmental variable for database port is not set")
	}

	// Get database name in environmental variables
	dbName := os.Getenv("MONGO_DATABASE_NAME")
	if dbName == "" {
		log.Fatalf("environmental variable for database name is not set")
	}

	// Get database timeout in environmental variables
	dbTimeoutMilliSeconds, err := strconv.Atoi(os.Getenv("MONGO_DATABASE_TIMEOUT_MILLISECONDS"))
	if err != nil {
		log.Fatalf("environmental variable for database timeout is not set")
	}
	dbTimeoutDuration := time.Duration(dbTimeoutMilliSeconds) * time.Millisecond

	// Get database use SSL in environmental variables
	dbUseSSL, err := strconv.ParseBool(os.Getenv("MONGO_DATABASE_USE_SSL"))
	if err != nil {
		log.Fatalf("environmental variable for database use SSL is not set")
	}

	// Get database max pool size in environmental variables
	dbMaxPoolSize := os.Getenv("MONGO_DATABASE_MAX_POOL_SIZE")
	if dbName == "" {
		log.Fatalf("environmental variable for database max pool size is not set")
	}

	// Get database auth mechanism in environmental variables
	dbAuthMechanism := os.Getenv("MONGO_DATABASE_AUTH_MECHANISM")
	if dbName == "" {
		log.Fatalf("environmental variable for database auth mechanism is not set")
	}

	// Get database username and password in environmental variables
	userNamePasswordIsRequired := dbAuthMechanism == "SCRAM" || dbAuthMechanism == "PLAIN" || dbAuthMechanism == "MONGODB-AWS"

	// dbUser := os.Getenv("MONGO_DATABASE_USERNAME")
	dbUser := os.Getenv("MONGO_INITDB_ROOT_USERNAME")
	if userNamePasswordIsRequired && dbUser == "" {
		log.Fatalf("environmental variable for database user is not set")
	}
	// Get database password in environmental variables
	// dbPassword := os.Getenv("MONGO_DATABASE_PASSWORD")
	dbPassword := os.Getenv("MONGO_INITDB_ROOT_PASSWORD")
	if userNamePasswordIsRequired && dbPassword == "" {
		log.Fatalf("environmental variable for database password is not set")
	}

	// Get database OIDC environment in environmental variables
	dbOidcEnv := os.Getenv("MONGO_DATABASE_OIDC_ENVIRONMENT")
	if dbAuthMechanism == "MONGODB-OIDC" && dbOidcEnv == "" {
		log.Fatalf("environmental variable for database OIDC environment is not set")
	}

	// Get database token resource in environmental variables
	dbTokenResource := os.Getenv("MONGO_DATABASE_OIDC_TOKEN_RESOURCE")
	if dbAuthMechanism == "MONGODB-OIDC" && dbTokenResource == "" {
		log.Fatalf("environmental variable for database token resource is not set")
	}

	// Get database address
	dbAddress := net.JoinHostPort(dbHost, dbPort)

	// Get database connection string
	dbConnectionString := fmt.Sprintf("mongodb://%v/%v", dbAddress, dbName)

	// Get database credentials
	var dbCredential options.Credential
	if userNamePasswordIsRequired && dbAuthMechanism != "SCRAM" {
		dbCredential = options.Credential{
			AuthMechanism: dbAuthMechanism,
			Username:      dbUser,
			Password:      dbPassword,
		}
	} else if dbAuthMechanism == "SCRAM" {
		dbAuthSource := os.Getenv("MONGO_DATABASE_AUTHSOURCE")
		if dbAuthSource == "" {
			log.Fatalf("environmental variable for database auth source is not set")
		}
		dbCredential = options.Credential{
			Username:   dbUser,
			Password:   dbPassword,
			AuthSource: dbAuthSource,
		}
	} else if dbAuthMechanism == "MONGODB-OIDC" {
		props := map[string]string{
			"ENVIRONMENT":    dbOidcEnv,
			"TOKEN_RESOURCE": dbTokenResource,
		}

		dbCredential = options.Credential{
			AuthMechanism:           dbAuthMechanism,
			AuthMechanismProperties: props,
		}
	}

	fmt.Printf("Db connection string is %v \n", dbConnectionString)

	return &mongoDBConfig{
		Host:             dbHost,
		Port:             dbPort,
		User:             dbUser,
		Password:         dbPassword,
		DatabaseName:     dbName,
		Address:          dbAddress,
		TimeoutDuration:  dbTimeoutDuration,
		UseSSL:           dbUseSSL,
		MaxPoolSize:      dbMaxPoolSize,
		AuthCredentials:  dbCredential,
		ConnectionString: dbConnectionString,
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
