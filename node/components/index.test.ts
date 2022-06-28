import { aws, azure } from "./index";

it("exports correctly", () => {
  expect(aws).toBeDefined();
  expect(azure).toBeDefined();
});
