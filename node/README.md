![image](https://user-images.githubusercontent.com/33742989/176105837-d54c9a4d-8c13-4a0b-ab20-d0435dfebf7e.png)

# gs-pulumi-library

GoSource Pulumi shared component library.

`gs-pulumi-library` contains: i) Pulumi resource components for provisioning common resources, and ii) Pulumi policy components to be used in your [Pulumi Policypacks](https://www.pulumi.com/docs/guides/crossguard/configuration/).

**Pulumi Resource Components**

The following components are currently configured:

| Component                                                                                                           | Description                                                              |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [aws:CloudFrontWebsite](https://github.com/gs-gs/pulumi-library/blob/main/node/components/aws/CloudfrontWebsite.ts) | Cloudfront distribution with S3 origin, alias/cert and access logging    |
| [aws:S3Bucket](https://github.com/gs-gs/pulumi-library/blob/main/node/components/aws/S3Bucket.ts)                   | S3 bucket with default encryption and access logging                     |
| [aws:Vpc](https://github.com/gs-gs/pulumi-library/blob/main/node/components/aws/Vpc.ts)                             | Multi-AZ VPC with public/private subnets, internet gateway and flow logs |

**Pulumi Policy Components**

The following components are currently configured:

| Component                                                                                           | Description                                     |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [aws:ApiGateway](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/apiGateway.ts) | Resource compliance policies for aws:ApiGateway |
| [aws:Cloudfront](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/cloudfront.ts) | Resource compliance policies for aws:Cloudfront |
| [aws:Kms](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/kms.ts)               | Resource compliance policies for aws:KMS        |
| [aws:Lambda](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/lambda.ts)         | Resource compliance policies for aws:Lambda     |
| [aws:S3](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/s3.ts)                 | Resource compliance policies for aws:S3         |
| [aws:Vpc](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/vpc.ts)               | Resource compliance policies for aws:Vpc        |

## Recommended Deployment Pattern

**Example deployment scripts**

| Deployment                                                                                                         | Description                                                                                |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| [State stored in S3 Bucket](https://github.com/gs-gs/pulumi-library/blob/main/examples/node/scripts/run-pulumi.sh) | Demonstrates logging into S3 state backend and running Pulumi commands to provision infra. |
