package main

import (
	"fmt"
	"net/http"
	"runtime"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("Listening on :8080")
	r := mux.NewRouter()
	r.HandleFunc("/", handler).Methods("GET")
	http.ListenAndServe(":8080", r)
}

func handler(w http.ResponseWriter, r *http.Request) {
	n := runtime.NumCPU()
	runtime.GOMAXPROCS(n)

	quit := make(chan bool)

	fmt.Printf("Starting CPU stress on %d cores for 10 seconds...\n", n)

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

	time.Sleep(10 * time.Second)
	for i := 0; i < n; i++ {
		quit <- true
	}

	fmt.Println("End CPU stress.")
}
