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

type appNetworkConfig struct {
	Address string
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
	Api             *appNetworkConfig
	Web             *appNetworkConfig
	PgsqlDB         *pgsqlDBConfig
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
		AppName:         fmt.Sprintf("%s-api", appName),
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

func loadApi() *appNetworkConfig {

	var ap string
	mustMapEnv(&ap, "API_PORT")

	return &appNetworkConfig{
		Address: ":" + ap,
	}
}

func loadWeb() *appNetworkConfig {
	return &appNetworkConfig{
		Address: ":",
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
