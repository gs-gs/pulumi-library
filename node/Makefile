SHELL := /bin/bash

build:
	rm -rf dist
	rm -rf node_modules
	rm -f gs-pulumi-library*.tgz
	npm install --force
	npm run lint
	npm run build
	npm pack
