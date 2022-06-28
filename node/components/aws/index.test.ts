import { CloudfrontWebsite, S3Bucket, Vpc } from "./index";

it("exports correctly", () => {
  expect(CloudfrontWebsite).toBeDefined();
  expect(S3Bucket).toBeDefined();
  expect(Vpc).toBeDefined();
});
