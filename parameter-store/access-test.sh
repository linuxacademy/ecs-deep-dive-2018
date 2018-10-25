#!/usr/bin/env bash

# Test access to the SSM Parameter store.

# Upload access-test.sh to an S3 bucket in your account.
# Make sure the object is publicly accessible and note down the object link,
# for example https://s3-us-east-1.amazonaws.com/my-new-bucket/access-test.sh

# Install the AWS CLI
apt-get -y install python2.7 curl
curl -O https://bootstrap.pypa.io/get-pip.py
python2.7 get-pip.py
pip install awscli

# Get Region
EC2_AVAIL_ZONE=`curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone`
EC2_REGION="`echo \"$EC2_AVAIL_ZONE\" | sed -e 's:\([0-9][0-9]*\)[a-z]*\$:\\1:'`"

# Retrieve parameters from Parameter Store
APP1_WITH_ENCRYPTION=`aws ssm get-parameters --names prod.app1.db-pass --with-decryption --region $EC2_REGION --output text 2>&1`
APP1_WITHOUT_ENCRYPTION=`aws ssm get-parameters --names prod.app1.db-pass --no-with-decryption --region $EC2_REGION --output text 2>&1`
LICENSE_WITH_ENCRYPTION=`aws ssm get-parameters --names general.license-code --with-decryption --region $EC2_REGION --output text 2>&1`
LICENSE_WITHOUT_ENCRYPTION=`aws ssm get-parameters --names general.license-code --no-with-decryption --region $EC2_REGION --output text 2>&1`
APP2_WITHOUT_ENCRYPTION=`aws ssm get-parameters --names prod.app2.user-name --no-with-decryption --region $EC2_REGION --output text 2>&1`

# The nginx server is started after the script is invoked, preparing folder for HTML.
if [ ! -d /usr/share/nginx/html/ ]; then
mkdir -p /usr/share/nginx/html/;
fi
chmod 755 /usr/share/nginx/html/

# Creating an HTML file to be accessed at http://<public-instance-DNS-name>/ecs.html
cat > /usr/share/nginx/html/ecs.html <<EOF
<!DOCTYPE html>
<html>
<head>
<title>Amazon ECS Deep Dive - Using Parameter Store and IAM Roles</title>
<style>
body {
    font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    padding-top: 2em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
}
code {white-space: pre-wrap; background-color: rgba(27,31,35,0.05); color: #24292e; padding: 0.2em 0.4em; margin: 0; border-radius: 3px}
result {background: hsl(69, 77%, 90%);}
</style>
</head>
<body>
<h1>Amazon ECS Deep Dive<h1>
<h2>Using Parameter Store and IAM Roles</h2>
<p style="padding-bottom: 1em;">Following are the results of different access attempts as experienced by the <code>access-test</code> task in ECS.</p>

<p style="color: red">Note: This page is statically generated on container start. If you change any permissions to the roles or policies in IAM, then stop the task and run it again to see the effects here.</p>
<br/>
<p><b>Access to prod.app1.db-pass:</b><br/>
<pre><code>aws ssm get-parameters --names prod.app1.db-pass --with-decryption</code><br/>
<code><result>$APP1_WITH_ENCRYPTION</result></code><br/>
<code>aws ssm get-parameters --names prod.app1.db-pass --no-with-decryption</code><br/>
<code><result>$APP1_WITHOUT_ENCRYPTION</result></code></pre><br/>
</p>

<p><b>Access to general.license-code:</b><br/>
<pre><code>aws ssm get-parameters --names general.license-code --with-decryption</code><br/>
<code><result>$LICENSE_WITH_ENCRYPTION</result></code><br/>
<code>aws ssm get-parameters --names general.license-code --no-with-decryption</code><br/>
<code><result>$LICENSE_WITHOUT_ENCRYPTION</result></code></pre><br/>
</p>

<p><b>Access to prod.app2.user-name:</b><br/>
<pre><code>aws ssm get-parameters --names prod.app2.user-name --no-with-decryption</code><br/>
<code><result>$APP2_WITHOUT_ENCRYPTION</result></code><br/>
</p>
</body>
</html>
EOF