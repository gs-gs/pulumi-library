import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface CloudfrontWebsiteArgs {
  description: string;
  s3Bucket: aws.s3.Bucket;

  hostedZoneDomain: string; // root hosted zone domain
  targetDomain: string; // domain/host to serve content at.
  certificateArn?: string; // (Optional) ACM certificate ARN for the target domain; must be in the us-east-1 region. If omitted, an ACM certificate will be created.

  logBucket?: aws.s3.Bucket | "none"; // (Optional) Enables cloudfront access logging to specified S3 Bucket. If omitted, a new S3 Bucket will be created.
  logBucketPrefix?: string; // (Optional) S3 Bucket prefix for access logs.

  originAccessIdentity: aws.cloudfront.OriginAccessIdentity; // Origin Access Identity to access the private s3 bucket

  webAclId?: string | pulumi.Output<string>; // (Optional) Associate an existing WAF
}

/**
 * Component for creating Cloudfront Distribution backed by S3 static website.
 *
 * Default config:
 *  - S3 bucket policy allowing access from Cloudfront `originAccessIdentity`
 *  - ACM certificate created for specified domain
 *  - root object and error path -> "index.html"
 *
 * Optional config:
 *  - Cloudfront access logging
 *  - Use existing ACM certificate (must be in us-east-1)
 */
export class CloudfrontWebsite extends pulumi.ComponentResource {
  s3Bucket: aws.s3.Bucket;
  bucketPolicy: aws.s3.BucketPolicy;
  certificate: aws.acm.Certificate;
  cloudfrontDistribution: aws.cloudfront.Distribution;
  originAccessIdentity: aws.cloudfront.OriginAccessIdentity;

  constructor(name: string, args: CloudfrontWebsiteArgs, opts?: pulumi.ComponentResourceOptions) {
    super("aws-s3-cloudfront", name, {}, opts);

    // Define us-east-1 provider (required for CloudFront certificates)
    // Provider name must be unique
    const useast1 = new aws.Provider(`${args.targetDomain}-useast1`, { region: "us-east-1" });

    this.s3Bucket = args.s3Bucket;
    this.originAccessIdentity = args.originAccessIdentity;

    this.bucketPolicy = new aws.s3.BucketPolicy(`${args.targetDomain}-bucketPolicy`, {
      bucket: this.s3Bucket.id, // refer to the bucket created earlier
      policy: pulumi.all([this.originAccessIdentity.iamArn, this.s3Bucket.arn]).apply(([oaiArn, bucketArn]) =>
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                AWS: oaiArn,
              }, // Only allow Cloudfront read access.
              Action: ["s3:GetObject"],
              Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
            },
          ],
        })
      ),
    });

    // Cloudfront distribution

    // Get hosted zone
    const hostedZoneId = aws.route53
      .getZone({ name: args.hostedZoneDomain }, { async: true })
      .then((zone) => zone.zoneId);

    if (args.certificateArn) {
      const certificateByDomain = pulumi.output(
        aws.acm.getCertificate(
          {
            domain: args.targetDomain,
            statuses: ["ISSUED"],
          },
          { provider: useast1 }
        )
      );
      this.certificate = aws.acm.Certificate.get(`${args.targetDomain}-certificate-existing`, certificateByDomain.id);
    } else {
      // If certificate not specified, create ACM Certificate
      this.certificate = new aws.acm.Certificate(
        `${args.targetDomain}-certificate`,
        { domainName: args.targetDomain, validationMethod: "DNS" },
        { provider: useast1 }
      );

      // Create and validate DNS records
      const certificateDnsRecords: aws.route53.Record[] = [];
      this.certificate.domainValidationOptions.apply((dvo_list) => {
        dvo_list.forEach((dvo) => {
          certificateDnsRecords.push(
            new aws.route53.Record(`${dvo.resourceRecordName}`, {
              name: dvo.resourceRecordName,
              records: [dvo.resourceRecordValue],
              ttl: 60,
              type: dvo.resourceRecordType,
              zoneId: hostedZoneId,
            })
          );
        });
      });
      const certificateValidation = new aws.acm.CertificateValidation(
        `${args.targetDomain}-certificateValidation`,
        {
          certificateArn: this.certificate.arn,
          validationRecordFqdns: certificateDnsRecords.map((record) => record.fqdn),
        },
        { provider: useast1 }
      );
    }

    // Create Cloudfront distribution
    const cloudFrontArgs: aws.cloudfront.DistributionArgs = {
      enabled: true,
      aliases: [args.targetDomain],
      origins: [
        {
          originId: this.s3Bucket.arn,
          domainName: this.s3Bucket.bucketRegionalDomainName,
          s3OriginConfig: {
            originAccessIdentity: this.originAccessIdentity.cloudfrontAccessIdentityPath,
          },
        },
      ],
      defaultRootObject: "index.html",
      defaultCacheBehavior: {
        targetOriginId: this.s3Bucket.arn,
        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD", "OPTIONS"],
        forwardedValues: {
          cookies: { forward: "none" },
          queryString: false,
        },
        minTtl: 0,
        defaultTtl: 60 * 10,
        maxTtl: 60 * 10,
      },
      customErrorResponses: [
        {
          errorCode: 403,
          responseCode: 403,
          responsePagePath: "/index.html",
        },
      ],
      priceClass: "PriceClass_All",

      restrictions: {
        geoRestriction: {
          restrictionType: "none",
        },
      },
      viewerCertificate: {
        acmCertificateArn: this.certificate.arn,
        sslSupportMethod: "sni-only",
      },
    };

    // Enable Cloudfront access logging if argument `logBucket` is specified
    // Get `args.logBucket` if specified, or create new S3 Bucket if not...
    if (args.logBucket !== "none") {
      const logBucket = args.logBucket
        ? args.logBucket
        : new aws.s3.Bucket(`${args.targetDomain}-logs`, {
            bucket: `${args.targetDomain}-logs`,
            acl: "private",
          });

      // logsBucket is an S3 bucket that will contain the CDN's request logs.
      cloudFrontArgs["loggingConfig"] = {
        bucket: logBucket.bucketDomainName,
        includeCookies: true,
        prefix: args.logBucketPrefix,
      };
    }

    if (args.webAclId) {
      cloudFrontArgs["webAclId"] = args.webAclId;
    }

    this.cloudfrontDistribution = new aws.cloudfront.Distribution(
      `${args.targetDomain}-cloudfront-dist`,
      cloudFrontArgs
    );

    // Create Route53 Aliases
    const cloudfrontWebsiteAliasRecord = new aws.route53.Record(`${args.targetDomain}-websiteAliasRecord`, {
      name: args.targetDomain,
      zoneId: hostedZoneId,
      type: "A",
      aliases: [
        {
          name: this.cloudfrontDistribution.domainName,
          zoneId: this.cloudfrontDistribution.hostedZoneId,
          evaluateTargetHealth: true,
        },
      ],
    });
  }

  public cloudfrontAliases(): pulumi.Output<string[] | undefined> {
    return this.cloudfrontDistribution.aliases;
  }
 
  public cloudfrontARN(): pulumi.Output<string[] | undefined> {
    return this.cloudfrontDistribution.arn;
  }
}
