
# Picture Upload

A multi-project repo of services that work together to form a demo to enable users to get and upload photos to Amazon S3.

## About this project

This project is composed of independent Node.js services:

- web-client: a front-end client for viewing and storing images
- photo-filter: a REST API for applying filters to a given image
- photo-storage: a REST API for creating, reading, and deleting images in Amazon S3

## Development Installation

1. Clone the repository into your local machine
1. Go into the new folder `s3photoapp` folder and run `make install` to install all the packages for each app.

## Development Deployment

### Using your local machine

1. Install via `Development Installation` instructions
1. Ensure that you have completed AWS CLI configuration on your host machine (see: [Configuring the AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html))
1. Go into each folder in `s3photoapp/apps` and run `npm run dev`

### Verifying Deployment

1. Navigate to the web-client homepage at [localhost:3000](localhost:3000)
2. Select an image file (jpeg, png, bmp only) and upload
3. Observe the image has had a greyscale filter applied to it and added to the list of images

## Environment Variables

### Environment Variable Reference

**web-client:**

- `PORT`:
  - Default: "3000"
  - Description: The port number to listen on
- `FILTER_HOST`:
  - Default: "localhost"
  - Description: The host name of the url that the `photo-filter` service is listening on.
- `FILTER_PORT`:
  - Default: "3002"
  - Description: The port number of the url that the `photo-filter` service is listening on.
- `STORAGE_HOST`:
  - Default: "localhost"
  - Description: The host name of the url that the `photo-storage` service is listening on.
- `STORAGE_PORT`:
  - Default: "3001"
  - Description: The port number of the url that the `photo-filter` service is listening on.
- `AWS_REGION`:
  - Default: "us-east-1"
  - Description: The region to send AWS S3 Requests to
- `DEBUG`
  - Default: none
  - Description: Print logs of a specified type for debugging purposes
  - Possible Values: none, 'APP_VARS', '*'

**photo-filter:**

- `PORT`:
  - Default: "3002"
  - Description: The port number to listen on

**photo-storage:**

- `PORT`:
  - Default: "3001"
  - Description: The port number to listen on
- `STAGE`:
  - Default: none
  - Description: The deployment environment
- `AWS_REGION`:
  - Default: "us-east-1"
  - Description: The region to send AWS S3 Requests to