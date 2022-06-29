import * as aws from "@pulumi/aws";
import {
  EnforcementLevel,
  ReportViolation,
  ResourceValidationPolicy,
  StackValidationArgs,
  StackValidationPolicy,
  validateResourceOfType,
} from "@pulumi/policy";

/** Checks whether an AWS Lambda function is allowed access to an Amazon Virtual Private Cloud.
 *
 * See: https://docs.aws.amazon.com/config/latest/developerguide/lambda-inside-vpc.html
 */
export const lambdaInsideVpc: ResourceValidationPolicy = {
  name: "lambda-inside-vpc",
  description: "Checks whether an AWS Lambda function is allowed access to an Amazon Virtual Private Cloud.",
  validateResource: validateResourceOfType(aws.lambda.Function, (lambdaFn, _, reportViolation) => {
    if (!lambdaFn.vpcConfig?.securityGroupIds || lambdaFn.vpcConfig.securityGroupIds.length === 0) {
      reportViolation(`Lambda function "${lambdaFn.name}" has no security groups configured.`);
    }

    if (!lambdaFn.vpcConfig?.subnetIds || lambdaFn.vpcConfig.subnetIds.length === 0) {
      reportViolation(`Lambda function "${lambdaFn.name}" has no subnets configured.`);
    }
  }),
};
