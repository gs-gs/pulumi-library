module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: false,
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
};
