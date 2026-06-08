package middleware

import (
	"context"
	"connectrpc.com/connect"
	"fmt"
	"github.com/pkg/errors"
	// "net/http"
	"strings"
	"sync"
	"time"
	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"

	"cornucopia/listah/internal/app/bootstrap"
	model "cornucopia/listah/internal/pkg/model/v1"
	"cornucopia/listah/internal/pkg/utils"
)


func CheckAuth(infra *bootstrap.Infra) connect.UnaryInterceptorFunc {
	// Create a new Middleware/interceptor
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		// Define the handlerFunc which is called by the server eventually
		handler := connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			fmt.Printf("\n\n\n\n")

			tkn := extractAuth(req.Header().Get("Authorization") )
			ptkn, err := parseJWT(ctx, tkn, infra.Config.AuthDomain)
			if err != nil {
				e := utils.HandleError(infra, ctx, req, err)
				return nil, e
			}
			if err = verifyJWT(ctx, ptkn, infra.Config.AuthDomain);err != nil {
				e := utils.HandleError(infra, ctx, req, err)
				return nil, e
			}
			fmt.Printf("\n\n\n\n")
			return next(ctx, req)
		})
		// Return newly created handler
		return handler
	}
	// Return newly created middleware
	return connect.UnaryInterceptorFunc(interceptor)
}




var (
	jwksCache     jwk.Set
	jwksCacheTime time.Time
	jwksMutex     sync.Mutex
)
var maxCacheTime time.Duration = 60


func parseJWT(ctx context.Context, tokenString string, authDomain string) (jwt.Token, error) {
	if tokenString == "" {
		return nil, errors.New(model.MissingTokenMsg)
	}

	// 1. Load JWKS (cached for defined minutes)
	keySet, err := getClerkJWKS(ctx, authDomain)
	if err != nil {
		return nil, errors.New(model.FailedJWKSLoadMsg + errors.Cause(err).Error())
	}

	// 2. Parse + verify signature + validate claims
	token, err := jwt.Parse(
		[]byte(tokenString),
		jwt.WithKeySet(keySet),
		jwt.WithValidate(true),
	)
	if err != nil {
		return nil, errors.New(model.InvalidJWTMsg + errors.Cause(err).Error())
	}
	return token, nil
}

func verifyJWT(ctx context.Context, token jwt.Token, authDomain string) error {
	// 3. Validate issuer
	iss, _ := token.Get("iss")
	expectedIss := fmt.Sprintf("https://%s", authDomain)
	if iss != expectedIss {
		return errors.New(fmt.Sprintf("invalid issuer: %v", iss))
	}

	return nil
}


func extractAuth(header string) string {
	// extracts the bearer token from authorization header.
    if header == "" {
        return ""
    }
    if !strings.HasPrefix(header, "Bearer ") {
        return ""
    }
    return strings.TrimPrefix(header, "Bearer ")
}


func getClerkJWKS(ctx context.Context, authDomain string) (jwk.Set, error) {
	//fetches and caches Clerk's JWKS for defined minutes.
	// Set a lock so another process does not attempt to get/set a new jwks key.
	jwksMutex.Lock()
	defer jwksMutex.Unlock()

	// Cache for defined minutes
	if time.Since(jwksCacheTime) < maxCacheTime*time.Minute && jwksCache != nil {
			return jwksCache, nil
	}

	jwksURL := fmt.Sprintf("https://%s/.well-known/jwks.json", authDomain)

	keySet, err := jwk.Fetch(ctx, jwksURL)
	if err != nil {
			return nil, err
	}

	jwksCache = keySet
	jwksCacheTime = time.Now()

	return keySet, nil
}
