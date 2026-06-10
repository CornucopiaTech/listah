package redissrv

import (
	"context"
	"fmt"
	"github.com/pkg/errors"
	redis "github.com/redis/go-redis/v9"
	"log"

	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	// model "cornucopia/listah/internal/pkg/model/v1"
)

type Cache struct {
	Client *redis.Client
}

func Init(cfg *config.Config, logger *logging.Factory) *Cache {
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
		Client: rdb,
	}
}
