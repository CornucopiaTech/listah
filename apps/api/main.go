package main

import (
	"fmt"
	"log"
	"os"
	// "path/filepath"

	// "github.com/joho/godotenv"
	"github.com/pkg/errors"
	"google.golang.org/grpc/grpclog"

	// "cornucopia/listah/apps/api/internal/app/server"
	"cornucopia/listah/apps/api/internal/app/server"
)

func main() {
	// log.Printf("Starting to run connect-go server")
	// log.Printf("Reading env variables from env file")

	// if err := godotenv.Load(".env"); err != nil {
	// 	log.Printf("Env file not found in executable folder. Checking alternate location")

	// 	path, _ := os.Getwd()
	// 	rootDir := filepath.Dir(filepath.Dir(path))
	// 	envPath := filepath.Join(rootDir, ".env")

	// 	if err2 := godotenv.Load(envPath); err2 != nil {
	// 		log.Printf("Env file not found in project root.")
	// 		log.Fatal(errors.Cause(err2))
	// 	}
	// }
	if err := server.Run(); err != nil {
		fmt.Println(errors.Cause(err))
		log.Fatal(err)
		grpclog.Fatal(err)
	}
	defer os.Exit(0)
}
