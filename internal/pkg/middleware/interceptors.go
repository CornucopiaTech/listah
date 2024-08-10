package middleware

import (
	"cornucopia/listah/internal/app/bootstrap"
	"log"

	"connectrpc.com/connect"
	"connectrpc.com/otelconnect"
)

func GetInterceptors(infra *bootstrap.Infra) connect.Option {
	// The generated constructors return a path and a plain net/http
	// handler.
	otelInterceptor, err := otelconnect.NewInterceptor()
	if err != nil {
		log.Fatal(err)
	}

	return connect.WithInterceptors(
		otelInterceptor,
		RecordRequestInterceptor(infra),
	// NewAuthInterceptor()
	)

}
