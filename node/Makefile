SHELL := /bin/bash

build:
	rm -rf dist
	rm -rf node_modules
	rm -f gs-pulumi-library*.tgz

	npm cache clean --force
	
	npm ci
	npm run lint
	npm pack