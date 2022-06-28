import { PoliciesApiGateway, PoliciesCloudfront, PoliciesKms, PoliciesLambda, PoliciesS3, PoliciesVpc } from "./index";

it("exports correctly", () => {
  expect(PoliciesApiGateway).toBeDefined();
  expect(PoliciesCloudfront).toBeDefined();
  expect(PoliciesKms).toBeDefined();
  expect(PoliciesLambda).toBeDefined();
  expect(PoliciesS3).toBeDefined();
  expect(PoliciesVpc).toBeDefined();
});
