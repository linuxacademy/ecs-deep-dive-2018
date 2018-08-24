package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"runtime"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	log.Println("Listening on :80. Routes:")
	r := mux.NewRouter()
	r.HandleFunc("/", healthHandler)
	r.HandleFunc("/test", handler)
	r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		t, err := route.GetPathTemplate()
		if err != nil {
			return err
		}
		log.Println(t)
		return nil
	})
	log.Fatal(http.ListenAndServe(":80", r))
}

func handler(w http.ResponseWriter, r *http.Request) {

	requestDump, err := httputil.DumpRequest(r, true)
	if err != nil {
		fmt.Println(err)
	}
	log.Println(string(requestDump))

	n := runtime.NumCPU()
	runtime.GOMAXPROCS(n)

	quit := make(chan bool)

	msg := fmt.Sprintf("Starting CPU stress on %d cores for 10 seconds...\n", n)
	io.WriteString(w, msg)
	log.Print(msg)

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

	log.Println("End CPU stress.")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Health Check")
	io.WriteString(w, "OK\n")

	requestDump, err := httputil.DumpRequest(r, true)
	if err != nil {
		fmt.Println(err)
	}
	log.Println(string(requestDump))
}
