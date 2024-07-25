package config

import (
	"fmt"
	"log"
	"net"
	"os"
)

const appName string = "Listah"

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
type DatabaseConfig struct {
	Host             string
	DatabaseName     string
	Port             string
	User             string
	Password         string
	ConnectionString string
	Address          string
}

type TelemetryConfig struct {
	OtelExporterEndpoint string
}

type Config struct {
	AppName   string
	Env       string
	App       AppConfig
	Api       ApiConfig
	Database  DatabaseConfig
	Telemetry TelemetryConfig
}

func Init() (*Config, error) {
	apiConfig := loadApi()
	appConfig := loadApp()
	dbConfig := loadDatabase()
	telemetryConfig := loadTelemetry()

	return &Config{
		AppName:   appName,
		Env:       loadEnv(),
		Api:       *apiConfig,
		App:       *appConfig,
		Database:  *dbConfig,
		Telemetry: *telemetryConfig,
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

func loadApp() *AppConfig {
	appHost := os.Getenv("APP_HOST")
	if appHost == "" {
		log.Fatalf("environmental variable for app host is not set")
	}

	appPort := os.Getenv("APP_PORT")
	if appPort == "" {
		log.Fatalf("environmental variable for app port is not set")
	}

	return &AppConfig{
		Host:    appHost,
		Port:    appPort,
		Address: net.JoinHostPort(appHost, appPort),
	}
}

func loadDatabase() *DatabaseConfig {
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

	connectionString, err := loadConnectionString()
	if err != nil {
		log.Fatalf("Unable to get connection string for database")
	}

	return &DatabaseConfig{
		Host:             dbHost,
		Port:             dbPort,
		User:             dbUser,
		Password:         dbPassword,
		DatabaseName:     dbName,
		ConnectionString: connectionString,
		Address:          net.JoinHostPort(dbHost, dbPort),
	}
}

func loadConnectionString() (string, error) {
	return "This is a connection string", nil
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
