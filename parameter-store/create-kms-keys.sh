#!/usr/bin/env bash

if ! type "jq" > /dev/null; then
  echo "jq is not installed. See https://stedolan.github.io/jq/"
  exit 1
fi

AWS_REGION=us-east-1

echo "Creating KMS key for 'prod-app1'"
PROD_APP1_KEY=$(aws kms create-key --description prod-app1 --region $AWS_REGION | jq -r .KeyMetadata.KeyId)
aws kms create-alias --alias-name alias/prod-app1 --target-key-id "$PROD_APP1_KEY" --region $AWS_REGION

echo "Creating KMS key for 'license-code'"
LICENSE_CODE_KEY=$(aws kms create-key --description license-code --region $AWS_REGION | jq -r .KeyMetadata.KeyId)
aws kms create-alias --alias-name alias/license-code --target-key-id "$LICENSE_CODE_KEY" --region $AWS_REGION

echo "Creating SSM Parameter: 'prod.app1.db-pass'"
aws ssm put-parameter --name prod.app1.db-pass --value "P@ssw0rd1" --type SecureString --key-id "$PROD_APP1_KEY" --region $AWS_REGION --overwrite

echo "Creating SSM Parameter: 'prod.app2.user-name'"
aws ssm put-parameter --name prod.app2.user-name --value "johnsmith" --type String --region $AWS_REGION --overwrite

echo "Creating SSM Parameter: 'general.license-code'"
aws ssm put-parameter --name general.license-code --value "xJee2HesQy0" --type SecureString --key-id "$LICENSE_CODE_KEY" --region $AWS_REGION --overwrite
