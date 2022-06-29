import { PolicyPack } from "@pulumi/policy";

import * as apiGatewayPolicies from "gs-pulumi-library/policies/aws/apiGateway";
import * as cloudfrontPolicies from "gs-pulumi-library/policies/aws/cloudfront";
import * as kmsPolicies from "gs-pulumi-library/policies/aws/kms";
import * as lambdaPolicies from "gs-pulumi-library/policies/aws/lambda";
import * as s3Policies from "gs-pulumi-library/policies/aws/s3";
import * as vpcPolicies from "gs-pulumi-library/policies/aws/vpc";

new PolicyPack("gs-aws-policies", {
  enforcementLevel: "mandatory",
  policies: [
    // API Gateway Policies
    apiGatewayPolicies.apiGatewayEndpointType,
    apiGatewayPolicies.apiGatewayMethodCachedAndEncrypted,
    apiGatewayPolicies.apiGatewayStageCached,

    // Cloudfront Policies
    cloudfrontPolicies.cloudfrontAccesslogsEnabled,
    cloudfrontPolicies.cloudFrontOriginAccessIdentityEnabled,

    // KMS Policies
    kmsPolicies.cmkBackingKeyRotationEnabled,

    // Lambda Policies
    lambdaPolicies.lambdaInsideVpc,

    // Storage Policies
    { ...s3Policies.s3BucketLoggingEnabled, enforcementLevel: "advisory" }, // Override default `enforcementLevel`
    {
      ...s3Policies.s3BucketServiceSideEncryptionEnabled,
      enforcementLevel: "advisory",
    }, // Override default `enforcementLevel`

    // VPC Policies
    vpcPolicies.vpcFlowLogsEnabled,
    vpcPolicies.vpcDefaultSecurityGroupClosed,
  ],
});
