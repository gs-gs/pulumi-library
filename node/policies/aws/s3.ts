import * as aws from "@pulumi/aws";
import { EnforcementLevel, ResourceValidationPolicy, validateResourceOfType } from "@pulumi/policy";

/** Checks whether logging is enabled for your S3 buckets.
 *
 * See: https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-logging-enabled.html
 */
export const s3BucketLoggingEnabled: ResourceValidationPolicy = {
  name: "s3-bucket-logging-enabled",
  description: "Checks whether logging is enabled for your S3 buckets.",
  validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, _, reportViolation) => {
    if (!bucket.loggings || bucket.loggings.length === 0) {
      reportViolation(`Bucket logging is not defined for bucket: ${bucket.bucket}`);
    }
  }),
};

/** Checks if your Amazon S3 bucket either has the Amazon S3 default encryption enabled.
 *
 * See: https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-server-side-encryption-enabled.html
 */
export const s3BucketServiceSideEncryptionEnabled: ResourceValidationPolicy = {
  name: "s3-bucket-server-side-encryption-enabled",
  description: "Checks if your Amazon S3 bucket either has the Amazon S3 default encryption enabled.",
  validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, _, reportViolation) => {
    if (!bucket.serverSideEncryptionConfiguration?.rule?.applyServerSideEncryptionByDefault?.sseAlgorithm) {
      reportViolation(`Bucket default encryption is not enabled for bucket: ${bucket.bucket}`);
    }
  }),
};
