![image](https://user-images.githubusercontent.com/33742989/176105837-d54c9a4d-8c13-4a0b-ab20-d0435dfebf7e.png)

# gs-gs/pulumi-library
GoSource Pulumi shared component library.

## Overview of Pulumi

**What is Pulumi?**

[Pulumi](https://www.pulumi.com/docs/intro/concepts/) is an infrastructure as code SDK for defining/deploying infrastructure on any cloud, using your favorite languages.

**Why use Pulumi?**
1. write Infrastructure-as-Code in the same programming language as your application-code.
2. provision best-practice infrastructure quicker using component libraries.
3. use [Policy-as-Code](https://www.pulumi.com/docs/guides/crossguard/) (property-based testing) to enforce resource compliance to org policies.

## Install 'pulumi-library'

`npm install gs-pulumi-library`


## Usage

`gs-pulumi-library` contains: i) Pulumi resource components for provisioning common resources, and ii) Pulumi policy components to be used in your [Pulumi Policypacks](https://www.pulumi.com/docs/guides/crossguard/configuration/).

**Pulumi Resource Components**

The following components are currently configured:

| Component                  | Description       |  Node.JS     | Python      |
| -----------             | ----------- | ----------- | ----------- |
|  [aws:CloudFrontWebsite](https://github.com/gs-gs/pulumi-library/blob/main/node/components/aws/CloudfrontWebsite.ts)  | Cloudfront distribution with S3 origin, alias/cert and access logging  | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |
|  [aws:S3Bucket](https://github.com/gs-gs/pulumi-library/blob/main/node/components/aws/S3Bucket.ts)           | S3 bucket with default encryption and access logging  | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |
|  [aws:Vpc](https://github.com/gs-gs/pulumi-library/blob/main/node/components/aws/Vpc.ts)                | Multi-AZ VPC with public/private subnets, internet gateway and flow logs  | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |

**Pulumi Policy Components**

The following components are currently configured:

| Component                  | Description       |  Node.JS     | Python      |
| -----------             | ----------- | ----------- | ----------- |
|  [aws:ApiGateway](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/apiGateway.ts)  | Resource compliance policies for aws:ApiGateway  | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |
|  [aws:Cloudfront](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/cloudfront.ts)  | Resource compliance policies for aws:Cloudfront | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |
|  [aws:Kms](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/kms.ts)         | Resource compliance policies for aws:KMS | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |
|  [aws:Lambda](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/lambda.ts)         | Resource compliance policies for aws:Lambda  | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |
|  [aws:S3](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/s3.ts)         | Resource compliance policies for aws:S3  | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |
|  [aws:Vpc](https://github.com/gs-gs/pulumi-library/blob/main/node/policies/aws/vpc.ts)         | Resource compliance policies for aws:Vpc  | :heavy_check_mark:       | :hourglass_flowing_sand: Not yet! |

## Recommended Deployment Pattern

**Pulumi state-file**

Pulumi stores metadata about your infrastructure so that it can manage your cloud resources. This metadata is called state, and is stored as a JSON document.

We recommend you store your project state files in S3 or Azure Storage, in the same account as the resource you are privisioning.

**Example deployment scripts**

| Deployment | Description |
| ----------- | ----------- |
| [State stored in S3 Bucket](https://github.com/gs-gs/pulumi-library/blob/main/examples/node/scripts/run-pulumi.sh) | Demonstrates logging into S3 state backend and running Pulumi commands to provision infra. |
