package main

import (
	"fmt"
	"time"
)

func main() {

	fmt.Println("Scheduled task started.")
	time.Sleep(2 * time.Second)
	fmt.Println("Scheduled task ended.")
}
