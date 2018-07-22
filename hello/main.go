package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("Listening on :80")
	r := mux.NewRouter()
	r.HandleFunc("/", handler).Methods("GET")
	http.ListenAndServe(":80", r)
}

func handler(w http.ResponseWriter, r *http.Request) {
	hostname, _ := os.Hostname()
	fmt.Fprintf(w, "Hello from %s\n", hostname)
}
