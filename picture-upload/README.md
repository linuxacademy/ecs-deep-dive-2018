# Picture Upload

A multi-project repo of services that work together to form a demo to enable users to get and upload photos to Amazon S3.

## About this project

This project is composed of independent Node.js services:

- web-client: a front-end client for viewing and storing images
- photo-filter: a REST API for applying filters to a given image
- photo-storage: a REST API for creating, reading, and deleting images in Amazon S3

## Prerequisites

All prerequisite tools can be installed using the [prereq.sh](prereq.sh) script provided.

**Note**, To install on Amazon Linux 2, follow the steps in the next section.

## Development Installation

1. Requires [Node.js 6+](https://nodejs.org) and [Go 1.11+](https://golang.org).
1. Clone the repository into your local machine
1. Go into the new folder `picture-upload` folder and run `make install` to install all the packages for each app.

*To install on Amazon Linux 2*:

```sh
sudo yum update

sudo yum install docker

sudo service docker start
sudo usermod -a -G docker $USER

# log out and back in

# set up Node.js https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install 6

node -e "console.log('Running Node.js ' + process.version)"

sudo amazon-linux-extras install golang1.11

go version

git clone https://github.com/linuxacademy/ecs-deep-dive-2018

cd ecs-deep-dive-2018/picture-upload/

make install

# You will see some warnings about `SKIPPING OPTIONAL DEPENDENCY` and deprecated modules. These can be safely ignored.

# Install docker-compose

sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-Linux-x86_64 -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

# make sure you're in ~/ecs-deep-dive-2018/picture-upload

# edit docker-compose.yml, setting the AWS_ACCESS_KEY_ID, AWS_REGION, and AWS_SECRET_ACCESS_KEY values 

docker-compose up
```

## Development Deployment

### Using your local machine

1. Install via `Development Installation` instructions
1. Ensure that you have completed AWS CLI configuration on your host machine (see: [Configuring the AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html))
1. Go into each folder in `picture-upload/apps` and run `npm run dev`. For `photo-filter`, run `go build` and then `go run main.go` instead.

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

## Deploy to ECS Cluster

There are EC2 and Fargate versions for the Service and Task definition JSON files.

### Create Task Roles

Perform the following commands:

```sh
aws iam create-role --role-name PhotoStorageTaskRole --assume-role-policy-document file://assume-role.json
aws iam create-role --role-name WebClientTaskRole --assume-role-policy-document file://assume-role.json
```

### Attach Task Policies

For each of the task policies in the `task-policies` directory, perform the following commands:

```sh
aws iam put-role-policy --role-name PhotoStorageTaskRole --policy-name PhotoStorageTaskPolicy --policy-document file://photo-storage.json
aws iam put-role-policy --role-name WebClientTaskRole --policy-name WebClientTaskPolicy --policy-document file://web-client.json
```

### Register Task Definitions

For each of the task definitions in the `task-definitions` directory, edit the JSON files, making the following changes:

1. Replace `YOUR_ACCOUNT_ID_HERE` in `image`, `executionRoleArn`, and `taskRoleArn` with your 12-digit account ID.
1. Change the region from `us-east-1`, if desired.

Then perform the following commands:

```sh
aws ecs register-task-definition --cli-input-json file://photo-filter.json
aws ecs register-task-definition --cli-input-json file://photo-storage.json
aws ecs register-task-definition --cli-input-json file://web-client.json
```

### Create Services

For each of the service definitions in the `service-definitions` directory, edit the JSON files, making the following changes:

1. Set `clusterName` to your cluster.
1. Replace `YOUR_ACCOUNT_ID_HERE` in `registryArn` with your 12-digit account ID. Change the region from `us-east-1`, if desired.
1. Set `targetGroupArn` to the ARN of your load balancer's target group.

Then perform the following commands:

```sh
aws ecs create-service --cli-input-json file://photo-filter.json
aws ecs create-service --cli-input-json file://photo-storage.json
aws ecs create-service --cli-input-json file://web-client.json
```

### Verify Service Discovery

```sh
aws servicediscovery list-services
aws servicediscovery list-instances --service-id <service_id>
aws route53 list-resource-record-sets --hosted-zone-id <hosted_zone_id>
```

### Clean Up

Delete the policies, roles, services, and task definitions:

```sh
aws iam delete-role-policy --role-name PhotoStorageTaskRole --policy-name PhotoStorageTaskPolicy
aws iam delete-role-policy --role-name WebClientTaskRole --policy-name WebClientTaskPolicy

aws iam delete-role --role-name PhotoStorageTaskRole
aws iam delete-role --role-name WebClientTaskRole

aws ecs delete-service --service photo-filter --cluster production-cluster
aws ecs delete-service --service photo-storage --cluster production-cluster
aws ecs delete-service --service web-client --cluster production-cluster

aws ecs deregister-task-definition --task-definition photo-filter:1
aws ecs deregister-task-definition --task-definition photo-storage:1
aws ecs deregister-task-definition --task-definition web-client:1
```
