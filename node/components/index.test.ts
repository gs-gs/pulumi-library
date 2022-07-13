import { aws, azure, utils } from "./index";

it("exports correctly", () => {
  expect(aws).toBeDefined();
  expect(azure).toBeDefined();
  expect(utils.getFiles).toBeDefined();
});
