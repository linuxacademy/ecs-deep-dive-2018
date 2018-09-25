# Creating an ECS Cluster with CloudFormation

## Overview

The repository consists of a set of templates that deploy the following:

- A tiered [VPC](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Introduction.html) with public and private subnets, spanning an AWS region.
- A highly available ECS cluster deployed across two [Availability Zones](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) in an [Auto Scaling](https://aws.amazon.com/autoscaling/) group and that are AWS SSM enabled.
- A pair of [NAT gateways](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-nat-gateway.html) (one in each zone) to handle outbound traffic.
- An [Application Load Balancer (ALB)](https://aws.amazon.com/elasticloadbalancing/applicationloadbalancer/) to the public subnets to handle inbound traffic.
- ALB path-based routes for each ECS service to route the inbound traffic to the correct service.
- Centralized container logging with [Amazon CloudWatch Logs](http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html).
- A [Lambda Function](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) and [Auto Scaling Lifecycle Hook](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html) to [drain Tasks from your Container Instances](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-instance-draining.html) when an Instance is selected for Termination in your Auto Scaling Group.

## Template details

The templates below are included in this repository and reference architecture:

| Template | Description |
| --- | --- |
| [master.yaml](master.yaml) | This is the master template - deploy it to CloudFormation and it includes all of the others automatically. |
| [vpc.yaml](vpc.yaml) | This template deploys a VPC with a pair of public and private subnets spread across two Availability Zones. It deploys an [Internet gateway](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Internet_Gateway.html), with a default route on the public subnets. It deploys a pair of NAT gateways (one in each zone), and default routes for them in the private subnets. |
| [security-groups.yaml](security-groups.yaml) | This template contains the [security groups](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_SecurityGroups.html) required by the entire stack. They are created in a separate nested template, so that they can be referenced by all of the other nested templates. |
| [load-balancers.yaml](load-balancers.yaml) | This template deploys an ALB to the public subnets, which exposes the various ECS services. It is created in in a separate nested template, so that it can be referenced by all of the other nested templates and so that the various ECS services can register with it. |
| [ecs-cluster.yaml](ecs-cluster.yaml) | This template deploys an ECS cluster to the private subnets using an Auto Scaling group and installs the AWS SSM agent with related policy requirements. |
| [lifecyclehook.yaml](lifecyclehook.yaml) | This template deploys a Lambda Function and Auto Scaling Lifecycle Hook to drain Tasks from your Container Instances when an Instance is selected for Termination in your Auto Scaling Group.

After the CloudFormation templates have been deployed, the [stack outputs](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html) contain a link to the load-balanced URLs for each of the deployed microservices.

The ECS instances should also appear in the Managed Instances section of the EC2 console.

## Creating the Stack

Using the AWS CLI, execute the following command:

`aws cloudformation create-stack --capabilities CAPABILITY_NAMED_IAM --template-body file://master.yaml --stack-name mystackname`

Where `mystackname` is the desired name of your stack (i.e. "Production")
