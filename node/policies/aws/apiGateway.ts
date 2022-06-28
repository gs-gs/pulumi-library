import * as aws from "@pulumi/aws";

import {
  EnforcementLevel,
  ResourceValidationPolicy,
  validateResourceOfType,
} from "@pulumi/policy";

export const apiGatewayStageCached: ResourceValidationPolicy = {
  name: "apigateway-stage-cached",
  description: "Checks that API Gateway Stages have a cache cluster enabled.",
  validateResource: validateResourceOfType(
    aws.apigateway.Stage,
    (stage, _, reportViolation) => {
      if (!stage.cacheClusterEnabled) {
        reportViolation(
          `API Gateway Stage '${stage.stageName}' must have a cache cluster enabled.`
        );
      }
    }
  ),
};

export const apiGatewayMethodCachedAndEncrypted: ResourceValidationPolicy = {
  name: "apigateway-method-cached-and-encrypted",
  description:
    "Checks API Gateway Methods that responses are configured to be cached and that those cached responses are encrypted.",
  validateResource: validateResourceOfType(
    aws.apigateway.MethodSettings,
    (methodSettings, _, reportViolation) => {
      if (!methodSettings.settings.cachingEnabled) {
        reportViolation(
          `API Gateway Method '${methodSettings.methodPath}' must have caching enabled.`
        );
      }
      if (!methodSettings.settings.cacheDataEncrypted) {
        reportViolation(
          `API Gateway Method '${methodSettings.methodPath}' must encrypt cached responses.`
        );
      }
    }
  ),
};

export interface ApiGatewayEndpointTypeArgs {
  /**
   * Whether or not API Endpoint type EDGE is allowed. Will default to true
   * if no other ApiGatewayEndpointTypeArgs are provided.
   */
  allowEdge?: boolean;
  /** Whether or not API Endpoint type REGIONAL is allowed. */
  allowRegional?: boolean;
  /** Whether or not API Endpoint type PRIVATE is allowed. */
  allowPrivate?: boolean;
}

export const apiGatewayEndpointType: ResourceValidationPolicy = {
  name: "apigateway-endpoint-type",
  description:
    "Checks API Gateway endpoint configuration is one of the allowed types. (By default, only 'EDGE' is allowed.)",
  configSchema: {
    properties: {
      allowEdge: {
        type: "boolean",
        default: true,
      },
      allowRegional: {
        type: "boolean",
        default: false,
      },
      allowPrivate: {
        type: "boolean",
        default: false,
      },
    },
  },
  validateResource: validateResourceOfType(
    aws.apigateway.RestApi,
    (restApi, args, reportViolation) => {
      const { allowEdge, allowRegional, allowPrivate } = args.getConfig<
        Required<ApiGatewayEndpointTypeArgs>
      >();

      let endpointType = "(endpointConfiguration.types unspecified)";
      if (restApi.endpointConfiguration) {
        endpointType = restApi.endpointConfiguration.types;
      }

      const supportedTypes: string[] = [];
      if (allowEdge) {
        supportedTypes.push("EDGE");
      }
      if (allowRegional) {
        supportedTypes.push("REGIONAL");
      }
      if (allowPrivate) {
        supportedTypes.push("PRIVATE");
      }

      const wrappedReportViolation = () => {
        reportViolation(
          `API Gateway '${
            restApi.name
          }' must use a supported endpoint type [${supportedTypes.join(
            ","
          )}]. '${endpointType}' is unsupported.`
        );
      };

      switch (endpointType) {
        case "EDGE":
          if (!allowEdge) {
            wrappedReportViolation();
          }
          break;
        case "REGIONAL":
          if (!allowRegional) {
            wrappedReportViolation();
          }
          break;
        case "PRIVATE":
          if (!allowPrivate) {
            wrappedReportViolation();
          }
          break;

        default:
          // The API Gateway endpoint type is some other, unknown endpoint type.
          // Default to it causing a validation error.
          wrappedReportViolation();
          break;
      }
    }
  ),
};
