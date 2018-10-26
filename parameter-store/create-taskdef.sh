#!/usr/bin/env bash

ACCOUNT_ID=<Your_AWS_account_ID_here>
S3_URI=<S3_URI_to_access-tesh.sh>

aws ecs register-task-definition \
  --family access-test \
  --task-role-arn "arn:aws:iam::${ACCOUNT_ID}:role/prod-app1" \
  --container-definitions name="access-test",image="nginx",portMappings="[{containerPort=80,hostPort=80,protocol=tcp}]",readonlyRootFilesystem=false,cpu=512,memory=490,essential=true,entryPoint="sh,-c",command="\"/bin/sh -c \\\"apt-get update ; apt-get -y install curl ; curl -O $S3_URI ; chmod +x access-test.sh ; ./access-test.sh ; nginx -g 'daemon off;'\\\"\"" \
