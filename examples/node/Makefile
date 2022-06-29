SHELL := /bin/bash

# Default env variables
APP_NAME = app-name-goes-here
ENV ?= dev

AWS_REGION ?= ap-southeast-2
AWS_ACCOUNT_ID ?= 1234567890123
AWS_ROLENAME ?= automation-service

.EXPORT_ALL_VARIABLES: ; # send all vars to shell

install:
	echo "Hello World!"

lint:
	echo "Hello World!"

test:	
	echo "Hello World!"

build:
	echo "Hello World!"

### Deployment

pulumi-preview:
	. scripts/run-pulumi.sh preview

pulumi-up:
	. scripts/run-pulumi.sh up

pulumi-destroy:
	. scripts/run-pulumi.sh destroy