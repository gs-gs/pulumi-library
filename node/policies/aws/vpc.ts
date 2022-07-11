import * as aws from "@pulumi/aws";
import {
  EnforcementLevel,
  ReportViolation,
  ResourceValidationPolicy,
  StackValidationArgs,
  StackValidationPolicy,
  validateResourceOfType,
} from "@pulumi/policy";

/** Checks whether Amazon Virtual Private Cloud flow logs are found and enabled for Amazon VPC.
 *
 * See: https://docs.aws.amazon.com/config/latest/developerguide/vpc-flow-logs-enabled.html
 */
export const vpcFlowLogsEnabled: StackValidationPolicy = {
  name: "vpc-flow-logs-enabled",
  description: "Checks whether Amazon Virtual Private Cloud flow logs are found and enabled for Amazon VPC.",
  validateStack: (args: StackValidationArgs, reportViolation: ReportViolation) => {
    const vpcs = args.resources.map((r) => r.asType(aws.ec2.Vpc)).filter((r) => r);
    const vpcFlowLogs = args.resources.map((r) => r.asType(aws.ec2.FlowLog)).filter((r) => r);

    const vpcsWithFlowLogs = vpcFlowLogs.map((flowlog) => flowlog?.vpcId);

    for (const vpc of vpcs) {
      if (vpc && !vpcsWithFlowLogs.includes(vpc.id)) {
        reportViolation(`Could not find a VPC Flow Log for VPC: ${vpc.id}.`);
      }
    }
  },
};

/** Checks that the default security group of any Amazon Virtual Private Cloud (VPC) does not allow inbound or outbound traffic.
 *
 * See: https://docs.aws.amazon.com/config/latest/developerguide/vpc-default-security-group-closed.html
 */
export const vpcDefaultSecurityGroupClosed: StackValidationPolicy = {
  name: "vpc-default-security-group-closed",
  description:
    "Checks that the default security group of any Amazon Virtual Private Cloud (VPC) does not allow inbound or outbound traffic.",
  validateStack: (args: StackValidationArgs, reportViolation: ReportViolation) => {
    const vpcs = args.resources.map((r) => r.asType(aws.ec2.Vpc)).filter((r) => r);
    const securityGroups = args.resources.map((r) => r.asType(aws.ec2.SecurityGroup)).filter((r) => r);

    for (const vpc of vpcs) {
      const defaultSecurityGroupId = vpc?.defaultSecurityGroupId;
      const sg = securityGroups.find((sg) => sg?.id === defaultSecurityGroupId);

      if (vpc && sg && sg.egress) {
        reportViolation(
          `Default SecurityGroup ${sg.id} for VPC ${vpc.id} allows egress: ${JSON.stringify(sg.egress)}.`
        );
      }

      if (vpc && sg && sg.ingress) {
        reportViolation(
          `Default SecurityGroup ${sg.id} for VPC ${vpc.id} allows ingress: ${JSON.stringify(sg.ingress)}.`
        );
      }
    }
  },
};
