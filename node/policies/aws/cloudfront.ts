import * as aws from "@pulumi/aws";
import {
  EnforcementLevel,
  ReportViolation,
  ResourceValidationPolicy,
  StackValidationArgs,
  StackValidationPolicy,
  validateResourceOfType,
} from "@pulumi/policy";

/** Checks if Amazon CloudFront distributions are configured to capture information from Amazon Simple Storage Service (Amazon S3) server access logs.
 *
 * See: https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-accesslogs-enabled.html
 */
export const cloudfrontAccesslogsEnabled: ResourceValidationPolicy = {
  name: "cloudfront-access-logging-enabled",
  description:
    "Checks if Amazon CloudFront distributions are configured to capture information from Amazon Simple Storage Service (Amazon S3) server access logs.",
  validateResource: validateResourceOfType(
    aws.cloudfront.Distribution,
    (distribution, _, reportViolation) => {
      if (!distribution.loggingConfig?.bucket) {
        reportViolation(
          `Cloudfront access logging is not configured for distribution with aliases: ${JSON.stringify(
            distribution.aliases
          )}.`
        );
      }
    }
  ),
};

/** Checks if Amazon CloudFront distribution with S3 Origin type has Origin Access Identity (OAI) configured.
 *
 * See: https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-origin-access-identity-enabled.html
 */
export const cloudFrontOriginAccessIdentityEnabled: StackValidationPolicy = {
  name: "cloudfront-origin-access-identity-enabled",
  description:
    "Checks if Amazon CloudFront distribution with S3 Origin type has Origin Access Identity (OAI) configured.",
  validateStack: (
    args: StackValidationArgs,
    reportViolation: ReportViolation
  ) => {
    const cloudfrontDists = args.resources
      .map((r) => r.asType(aws.cloudfront.Distribution))
      .filter((r) => r);

    for (const distribution of cloudfrontDists) {
      // Create list of all origins of S3 Type
      const s3Origins: aws.types.output.cloudfront.DistributionOrigin[] = [];
      distribution?.origins.forEach((origin) => {
        if (origin.originId.startsWith("arn:aws:s3")) {
          s3Origins.push(origin);
        }
      });

      for (const origin of s3Origins) {
        if (origin && !origin.s3OriginConfig?.originAccessIdentity) {
          reportViolation(
            `Cloudfront distribution "${distribution?.id}" has s3 origin "${origin.originId}" but no Origin Access Identity (OAI) configured.`
          );
        }
      }
    }
  },
};
