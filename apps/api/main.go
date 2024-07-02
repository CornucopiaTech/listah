package main

import (
	srv "cornucopia/listah/internal/app/server"
	"log"
)

func main() {
	if err := srv.Run(); err != nil {
		log.Fatalln(err)
	}
}
