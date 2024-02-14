import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

export interface VpcArgs extends awsx.ec2.VpcArgs {
  vpcName: string;
  description: string;

  flowlogBucket: aws.s3.Bucket;
}

/**
 * Component for creating VPC with best-practice security feature.
 * Can be extended by passing additional arguments to `args` conforming to type `awsx.ec2.VpcArgs`.
 * VPC configuration with best practice defaults as defined by Pulumi Crosswalks https://www.pulumi.com/docs/guides/crosswalk/aws/vpc/
 *
 * Default config:
 *  - An IPv4 CIDR block of 10.0.0.0/16.
 *  - The first 2 availability zones inside of your region.
 *  - 1x public and private subnet per availability zone.
 *  - Equally partitioned CIDR address spaces per subnet (per availability zone).
 *  - A NAT Gateway and EIP per private subnet.
 *  - A single Internet Gateway for all public subnets to use.
 *  - VPC flow logs to S3
 */
export class Vpc extends pulumi.ComponentResource {
  private _vpc: awsx.ec2.Vpc;

  constructor(name: string, args: VpcArgs, opts?: pulumi.ComponentResourceOptions) {
    super("aws-ec2-vpc", name, {}, opts);

    // Pull out `remainaingArgs` to pass into `awsx.ec2.Vpc` constructor.
    const { vpcName, description, ...remainingArgs } = args;

    this._vpc = new awsx.ec2.Vpc(args.vpcName, {
      numberOfAvailabilityZones: 2,
      subnets: [
        {
          type: "public",
        },
        {
          type: "private",
        },
      ],
      tags: {
        Name: args.vpcName,
      },
      ...remainingArgs, // Allow passing in additional `args` to constructor. Extends functionality of "Pulumi Crosswalks: VPC"
    });

    // VPC Flow Log
    const vpcFlowLog = new aws.ec2.FlowLog(`${args.vpcName}-VpcFlowLog`, {
      logDestination: args.flowlogBucket.arn,
      logDestinationType: "s3",
      trafficType: "ALL",
      vpcId: this._vpc.id,
      tags: {
        Name: `${args.vpcName}-VpcFlowLog`,
      },
    });
  }

  public get vpc(): pulumi.Output<awsx.ec2.Vpc> {
    return this._vpc;
  }

  public vpcId(): pulumi.Output<string> {
    return this._vpc.id;
  }
  public vpcDefaultSecurityGroupId(): pulumi.Output<string> {
    return this.vpc.defaultSecurityGroupId;
  }
  public privateSubnetIds(): Promise<pulumi.Output<string>[]> {
    return this._vpc.privateSubnetIds;
  }
  public publicSubnetIds(): Promise<pulumi.Output<string>[]> {
    return this._vpc.publicSubnetIds;
  }
}
