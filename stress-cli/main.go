package main

import (
	"log"
	"math"
	"runtime"
	"time"
)

func main() {
	n := runtime.NumCPU()
	runtime.GOMAXPROCS(n)

	quit := make(chan bool)

	log.Printf("Starting CPU stress on %d cores. Break to quit.\n", n)

	for i := 0; i < n; i++ {
		go func() {
			for {
				select {
				case <-quit:
					return
				default:
				}
			}
		}()
	}

	time.Sleep(time.Duration(math.MaxInt64)) // 292.4 years
}
