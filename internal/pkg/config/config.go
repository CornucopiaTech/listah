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

type AppConfig struct {
	Host    string
	Port    string
	Address string
}
type ApiConfig struct {
	Host    string
	Port    string
	Address string
}

type MongoDBConfig struct {
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

type PgsqlDBConfig struct {
	Host             string
	DatabaseName     string
	Port             string
	User             string
	Password         string
	Address          string
}

type TelemetryConfig struct {
	OtelExporterEndpoint string
}

type Config struct {
	AppName     string
	Env         string
	ProjectRoot string
	Api         ApiConfig
	PgsqlDB     PgsqlDBConfig
	MongoDB    MongoDBConfig
	Telemetry   TelemetryConfig
}

func Init() (*Config, error) {
	appName := os.Getenv("APP_NAME");
	log.Printf("Name of app: %s", appName)
	if appName == "" {
		log.Fatalf("environmental variable for application name is not set")
	}
	apiConfig := loadApi()
	pgsqlDBConfig := loadPgsqlDatabase()
	telemetryConfig := loadTelemetry()

	return &Config{
		AppName:     fmt.Sprintf("%s-api", appName),
		Env:         loadEnv(),
		ProjectRoot: loadProjectRoot(),
		Api:         *apiConfig,
		PgsqlDB:    *pgsqlDBConfig,
		Telemetry:   *telemetryConfig,
	}, nil

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

func loadApi() *ApiConfig {
	apiHost := os.Getenv("API_HOST")
	if apiHost == "" {
		log.Fatalf("environmental variable for api host is not set")
	}

	apiPort := os.Getenv("API_PORT")
	if apiPort == "" {
		log.Fatalf("environmental variable for api port is not set")
	}

	return &ApiConfig{
		Host:    apiHost,
		Port:    apiPort,
		Address: net.JoinHostPort(apiHost, apiPort),
	}
}

func loadMongoDatabase() *MongoDBConfig {
	// This parses through environmental variables and env file to get
	//    database config.
	// Connection string format: mongodb://username:password@host:port/databaseName?ssl=false&connectTimeoutMS=5000&maxPoolSize=50

	// Get database host in environmental variables
	dbHost := os.Getenv("DATABASE_HOST")
	if dbHost == "" {
		log.Fatalf("environmental variable for database host is not set")
	}

	// Get database port in environmental variables
	dbPort := os.Getenv("DATABASE_PORT")
	if dbPort == "" {
		log.Fatalf("environmental variable for database port is not set")
	}

	// Get database name in environmental variables
	dbName := os.Getenv("DATABASE_NAME")
	if dbName == "" {
		log.Fatalf("environmental variable for database name is not set")
	}

	// Get database timeout in environmental variables
	dbTimeoutMilliSeconds, err := strconv.Atoi(os.Getenv("DATABASE_TIMEOUT_MILLISECONDS"))
	if err != nil {
		log.Fatalf("environmental variable for database timeout is not set")
	}
	dbTimeoutDuration := time.Duration(dbTimeoutMilliSeconds) * time.Millisecond

	// Get database use SSL in environmental variables
	dbUseSSL, err := strconv.ParseBool(os.Getenv("DATABASE_USE_SSL"))
	if err != nil {
		log.Fatalf("environmental variable for database use SSL is not set")
	}

	// Get database max pool size in environmental variables
	dbMaxPoolSize := os.Getenv("DATABASE_MAX_POOL_SIZE")
	if dbName == "" {
		log.Fatalf("environmental variable for database max pool size is not set")
	}

	// Get database auth mechanism in environmental variables
	dbAuthMechanism := os.Getenv("DATABASE_AUTH_MECHANISM")
	if dbName == "" {
		log.Fatalf("environmental variable for database auth mechanism is not set")
	}

	// Get database username and password in environmental variables
	userNamePasswordIsRequired := dbAuthMechanism == "SCRAM" || dbAuthMechanism == "PLAIN" || dbAuthMechanism == "MONGODB-AWS"
	dbUser := os.Getenv("DATABASE_USERNAME")
	if userNamePasswordIsRequired && dbUser == "" {
		log.Fatalf("environmental variable for database user is not set")
	}
	// Get database password in environmental variables
	dbPassword := os.Getenv("DATABASE_PASSWORD")
	if userNamePasswordIsRequired && dbPassword == "" {
		log.Fatalf("environmental variable for database password is not set")
	}

	// Get database OIDC environment in environmental variables
	dbOidcEnv := os.Getenv("DATABASE_OIDC_ENVIRONMENT")
	if dbAuthMechanism == "MONGODB-OIDC" && dbOidcEnv == "" {
		log.Fatalf("environmental variable for database OIDC environment is not set")
	}

	// Get database token resource in environmental variables
	dbTokenResource := os.Getenv("DATABASE_OIDC_TOKEN_RESOURCE")
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
		dbAuthSource := os.Getenv("DATABASE_AUTHSOURCE")
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

	return &MongoDBConfig{
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

func loadPgsqlDatabase() *PgsqlDBConfig {
	dbHost := os.Getenv("DATABASE_HOST")
	if dbHost == "" {
		log.Fatalf("environmental variable for database host is not set")
	}

	dbPort := os.Getenv("DATABASE_PORT")
	if dbPort == "" {
		log.Fatalf("environmental variable for database port is not set")
	}

	dbUser := os.Getenv("POSTGRES_USER")
	if dbUser == "" {
		log.Fatalf("environmental variable for database user is not set")
	}

	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	if dbPassword == "" {
		log.Fatalf("environmental variable for database password is not set")
	}

	dbName := os.Getenv("POSTGRES_DB")
	if dbName == "" {
		log.Fatalf("environmental variable for database name is not set")
	}

	return &PgsqlDBConfig{
		Host:             dbHost,
		Port:             dbPort,
		User:             dbUser,
		Password:         dbPassword,
		DatabaseName:     dbName,
		Address:          net.JoinHostPort(dbHost, dbPort),
	}
}


func loadTelemetry() *TelemetryConfig {
	otel_endpoint := os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
	if otel_endpoint == "" {
		log.Fatalf("environmental variable for otel exporter endpoint is not set")
	}

	return &TelemetryConfig{
		OtelExporterEndpoint: otel_endpoint,
	}
}
