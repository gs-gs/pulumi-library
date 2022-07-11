import { ApiGateway, Cloudfront, Kms, Lambda, S3, Vpc } from "./index";

it("exports correctly", () => {
  expect(ApiGateway).toBeDefined();
  expect(Cloudfront).toBeDefined();
  expect(Kms).toBeDefined();
  expect(Lambda).toBeDefined();
  expect(S3).toBeDefined();
  expect(Vpc).toBeDefined();
});
