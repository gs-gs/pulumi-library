### Node example project deployed with Pulumi

1. Application code is at `app/`
2. Pulumi resources are defined at `infrastructure/`
3. Pulumi policies (resource compliance tests) are defined at `infrastructure/policypack/`
4. The bash script `scripts/run-pulumi.sh` handles retrieving AWS credentials, logging into the Pulumi S3 backend, and running the appropriate `pulumi` command
