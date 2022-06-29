import * as auditLogBucket from "./auditLogBucket";
import * as kms from "./kms";
import * as vpcs from "./vpcs";

// This is the main Pulumi entrypoint. Specify all modules here.
export = async () => {
  // Reference all other modules here
  return {
    auditLogBucket: auditLogBucket,
    kms: kms,
    vpcs: vpcs,
  };
};
