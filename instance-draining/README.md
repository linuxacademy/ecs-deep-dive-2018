# Automating Container Instance Draining

This template deploys a Lambda Function and Auto Scaling Lifecycle Hook to drain Tasks from your Container Instances when an Instance is selected for Termination in your Auto Scaling Group.

The file `sns-event.json` shows an example SNS message which is sent when an EC2
instance is scheduled for termination.

## Further Reading

- [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)

- [Amazon EC2 Auto Scaling Lifecycle Hooks](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html)

- [Container Instance Draining](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-instance-draining.html)
