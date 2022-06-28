import * as aws from "@pulumi/aws";
import {
  EnforcementLevel,
  ResourceValidationPolicy,
  validateResourceOfType,
} from "@pulumi/policy";

export const cmkBackingKeyRotationEnabled: ResourceValidationPolicy = {
  name: "cmk-backing-key-rotation-enabled",
  description:
    "Checks that key rotation is enabled for each customer master key (CMK). Checks that key rotation is enabled for specific key object. Does not apply to CMKs that have imported key material.",
  validateResource: validateResourceOfType(
    aws.kms.Key,
    async (instance, _, reportViolation) => {
      if (!instance.enableKeyRotation) {
        reportViolation("CMK does not have the key rotation setting enabled");
      }
    }
  ),
};
