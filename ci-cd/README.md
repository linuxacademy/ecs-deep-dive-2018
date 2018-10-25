# CI/CD Integration

This lesson shows how to use CodePipeline and CodeBuild to build an automated continuous deployment pipeline to ECS using clusters powered by Fargate or EC2.

Deployment steps:

1. Generate Github access token
    1. Browse https://github.com/settings/tokens
    1. Click *Generate new token*
    1. Enter description (i.e. _ECS Deep Dive_)
    1. Select `repo` scope
    1. Click *Generate token*
    1. Make sure to copy your new personal access token now. You won’t be able to see it again!
1. Fork https://github.com/linuxacademy/ecs-demo-php-simple-app into your own Github account.
1. Clone your fork locally: `git clone https://github.com/<your_github_username>/ecs-demo-php-simple-app`
1. Deploy CloudFormation template (`cf.yaml`).
    1. Use `us-east-1` if you would like Fargate capability.
    1. Use the Github access token generated in Step 1.
1. Browse Load Balancer's public DNS name to view initial version
1. Commit change
1. Watch the pipeline run
1. Browse Load Balancer's public DNS name to view changes
1. Repeat steps 6-8 as desired
