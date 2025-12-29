// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  moduleFileExtensions: ["ts", "js", "json"],

  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};
