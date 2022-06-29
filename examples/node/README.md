### Node example project deployed with Pulumi

<br/>

**Project overview**
1. Application code is at `app/`
2. Pulumi resources are defined at `infrastructure/`
3. Pulumi policies (resource compliance tests) are defined at `infrastructure/policypack/`
4. The bash script `scripts/run-pulumi.sh` handles retrieving AWS credentials, logging into the Pulumi S3 backend, and running the appropriate `pulumi` command

<br/>

**Deployment instructions**
1. Ensure that all necessary environment variables (in [Makefile](https://github.com/gs-gs/pulumi-library/blob/main/examples/node/Makefile)) have been set.
2. Run CI steps in your ci workflow:
    ```
    make install
    make lint
    make test
    make build
    ```
3. Run "pulumi preview" step:
    ```
    # This previews your changes explicitly before deploying.
    # It also run the compliance checks against the Policy-as-Code!
    
    make pulumi-preview
    ```
    
4. Run "pulumi up" step:
    ```
    # This previews and deploys changes to your program and/or infrastructure
    
    make pulumi-up
    ```
