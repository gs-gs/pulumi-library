import * as mime from "mime";
import * as path from "path";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { getAllFiles } from "./utils";

export interface S3BucketArgs extends aws.s3.BucketArgs {
  description: string;
  bucketName: string;

  kmsMasterKeyId?: string | pulumi.Output<string>; // kms CMK id for encryption-at-rest (with SSE-KMS). If omitted, defaults to SSE-S3.
  logBucket?: aws.s3.Bucket | "none"; // (Optional) Enables S3 access logging to specified S3 Bucket. If omitted, a new S3 Bucket will be created.
  logBucketPrefix?: string; // (Optional) S3 Bucket prefix for access logs.
  pathToBucketContents?: string; // relativepath to the bucket's contents
}

/**
 * Component for creating S3 Bucket with best-practice security feature.
 * Can be extended by passing additional arguments to `args` conforming to type `aws.s3.BucketArgs`.
 * `aws.s3.BucketObject` is not configurable
 *
 * Default config:
 *  - default encryption with SSE-S3 encryption (sseAlgorithm: "AES256")
 *  - lifecycle rules: none
 *  - access logging: none
 */
export class S3Bucket extends pulumi.ComponentResource {
  bucket: aws.s3.Bucket;

  constructor(
    name: string,
    args: S3BucketArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("aws-s3", name, {}, opts);

    // S3 bucket
    const s3BucketArgs: aws.s3.BucketArgs = {
      bucket: args.bucketName,
      serverSideEncryptionConfiguration: {
        rule: {
          applyServerSideEncryptionByDefault: args.kmsMasterKeyId
            ? {
                // If `kmsMasterKeyId` is provided, use it.
                kmsMasterKeyId: args.kmsMasterKeyId,
                sseAlgorithm: "aws:kms",
              }
            : {
                // If `kmsMasterKeyId` is NOT provided, use  SSE-S3 default encryption.
                sseAlgorithm: "AES256",
              },
        },
      },
      ...args,
    };

    // Enable S3 access logging, unless
    // Get `args.logBucket` if specified, or create new S3 Bucket if not...
    if (args.logBucket !== "none") {
      const logBucket = args.logBucket
        ? args.logBucket
        : new aws.s3.Bucket(`${args.bucketName}-logs`, {
            bucket: `${args.bucketName}-logs`,
            acl: "private",
          });

      s3BucketArgs["loggings"] = [
        {
          targetBucket: logBucket.bucket,
          targetPrefix: args.logBucketPrefix,
        },
      ];
    }
    this.bucket = new aws.s3.Bucket(`${args.bucketName}`, s3BucketArgs);

    // If argument `pathToBucketContents` is provided. Iterate through directory adding files to S3.
    // For each file in the directory, create an S3 object
    if (args.pathToBucketContents) {
      for (const filePath of getAllFiles(args.pathToBucketContents, [])) {
        const s3key = path.relative(args.pathToBucketContents, filePath);
        new aws.s3.BucketObject(`${args.bucketName}-${s3key}`, {
          bucket: this.bucket,
          key: s3key,
          source: new pulumi.asset.FileAsset(filePath), // use FileAsset to point to a file
          contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
        });
      }
    }
  }

  public bucketName(): pulumi.Output<string> {
    return this.bucket.bucket;
  }
}
