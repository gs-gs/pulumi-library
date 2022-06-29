import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { S3Bucket } from "gs-pulumi-library/components/aws/S3Bucket";

const stack = pulumi.getStack();

//
// Create S3 Bucket for audit logs
// NB - SSE-KMS is not supported for s3 access logging
// (https://aws.amazon.com/premiumsupport/knowledge-center/s3-server-access-log-not-delivered/)
export const auditLogBucket = new S3Bucket(`${stack}-audit-logs`, {
  description: `S3 Bucket for ${stack} audit logs.`,
  bucketName: `${stack}-audit-logs`,
  logBucket: "none",
});
