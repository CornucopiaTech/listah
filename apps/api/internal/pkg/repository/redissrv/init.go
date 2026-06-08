package redissrv

import (

	"fmt"
	"log"
	"context"
	"github.com/pkg/errors"
	redis "github.com/redis/go-redis/v9"
	"net/http"
	// "io"


	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	// model "cornucopia/listah/internal/pkg/model/v1"
)

type Cache struct {
	Client *redis.Client
}



func Init(cfg *config.Config, logger *logging.Factory) *Cache{
	opt, err := redis.ParseURL(cfg.RedisCache.ConnectionUrl)
	if err != nil {
		log.Printf("unable to parse url for redis cache.")
		log.Fatal(errors.Cause(err))
		// panic(err)
	}

	rdb := redis.NewClient(opt)

	hashFields := []string{
		"model", "Deimos",
		"brand", "Ergonom",
		"type", "Enduro bikes",
		"price", "4972",
	}

	ctx := context.Background()
	res1, err := rdb.HSet(ctx, "listah:sessions:ping:1", hashFields).Result()

	if err != nil {
		log.Printf("unable to write test object to redis cache.")
		log.Fatal(errors.Cause(err))
		// panic(err)
	}
	fmt.Println(res1) // >>> 4

	res2, err := rdb.HGet(ctx, "listah:sessions:ping:1", "model").Result()
	if err != nil {
		log.Printf("unable to read test object to redis cache.")
		log.Fatal(errors.Cause(err))
		// panic(err)
	}
	fmt.Println(res2) // >>> Deimos

	res3, err := rdb.HGet(ctx, "listah:sessions:ping:1", "price").Result()
	if err != nil {
		log.Printf("unable to read test object to redis cache.")
		log.Fatal(errors.Cause(err))
		// panic(err)
	}
	fmt.Println(res3) // >>> 4972

	// loadUsers(cfg, logger)

	defer rdb.Close()

	return &Cache{
		Client:     rdb,
	}
}


func loadUsers(cfg *config.Config, logger *logging.Factory) error {
	if _, ok := cfg.Endpoints["auth"]; !ok {
		log.Fatal("unable to read auth endpoint key from config.")
	}
	if _, ok := cfg.Endpoints["auth"]["list_users"]; !ok {
		log.Fatal("unable to read list users endpoint key from config.")
	}
	url := cfg.Endpoints["auth"]["list_users"]
	req, _ := http.NewRequest("GET", url, nil)
	tk := fmt.Sprintf("Bearer %s", cfg.AuthKey)
	req.Header.Add("Authorization", tk)
	res, _ := http.DefaultClient.Do(req)
	if res.StatusCode == 401 {
		log.Fatal("invalid auth key.")
	}
	if res.StatusCode == 422 {
		log.Fatal("invalid request parameters.")
	}
	if res.StatusCode == 400 {
		log.Fatal("request was unsuccessful.")
	}

	// body, _ := io.ReadAll(res.Body)
	// defer res.Body.Close()


	return nil
}
