import * as pulumi from "@pulumi/pulumi";

import { S3Bucket } from "gs-pulumi-library/components/aws/S3Bucket";
import { Vpc } from "gs-pulumi-library/components/aws/Vpc";

import { auditLogBucket } from "./auditLogBucket";

const stack = pulumi.getStack();

//
// Create S3 Bucket for VPC Flowlogs
const flowlogBucket = new S3Bucket(`${stack}-flowlogs-bucket`, {
  description: "S3 Bucket for VPC flow logs",
  bucketName: `${stack}-flowlogs-bucket`,
  logBucket: auditLogBucket.bucket,
  logBucketPrefix: `s3/flowlogs/`,
});

//
// Create VPC
const myVpc = new Vpc(`${stack}-vpc`, {
  vpcName: `${stack}-vpc`,
  description: "VPC for the project XYZ",
  flowlogBucket: flowlogBucket.bucket,
});

export const vpcDefaultSecurityGroupId = myVpc.vpcDefaultSecurityGroupId();
export const vpcId = myVpc.vpcId();
export const vpcPrivateSubnetIds = myVpc.privateSubnetIds();
export const vpcPublicSubnetIds = myVpc.publicSubnetIds();
