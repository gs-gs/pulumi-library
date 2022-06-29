import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const stack = pulumi.getStack();

// This is a simple resource to provision, so we don't need to use a pre-defined Component from the component library...
const kmsCmk = new aws.kms.Key(`${stack}-CMK`, {
  enableKeyRotation: true, // Enable as desired
  description: `KMS Customer Managed Key for stack: ${stack}`,
});

export const kmsCmkAlias = new aws.kms.Alias(`${stack}-CMK-alias`, {
  name: `alias/${stack}-CMK`,
  targetKeyId: kmsCmk.keyId,
});
