# Scheduled Task

Dummy scheduled task intended to demonstrate running an ECS task on a `cron`-like schedule.

Build the container image:

`make build`

Run the container image:

`make run`

Inspect the labels by iterating through them, and printing them each in a new line:

`make inspect`

Set the `ECR_REPO` environment variable to your ECR Repository URI. For example:

`export ECR_REPO=123456789012.dkr.ecr.us-east-1.amazonaws.com/scheduled-task`

After the build completes, tag your image so you can push the image to this repository:

`make tag`

Run the following command to push this image to your newly created AWS repository:

`make push`