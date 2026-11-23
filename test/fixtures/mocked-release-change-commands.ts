import { mockedGithubToken } from "./mocked-github-token.js";
import { mockedNpmToken } from "./mocked-npm-token.js";

export const mockedReleaseChangeCommands: {
  packageManager: "npm" | "pnpm" | "yarn";
  expectedCommand: string;
  expectedArgs: string[];
  expectedEnvWithoutNpmToken: Record<string, string>;
  expectedEnvWithNpmToken: Record<string, string>;
}[] = [
  {
    packageManager: "npm",
    expectedCommand: "npx",
    expectedArgs: ["@release-change/cli"],
    expectedEnvWithoutNpmToken: {
      RELEASE_TOKEN: mockedGithubToken,
      ISSUE_PR_TOKEN: mockedGithubToken
    },
    expectedEnvWithNpmToken: {
      RELEASE_TOKEN: mockedGithubToken,
      ISSUE_PR_TOKEN: mockedGithubToken,
      NPM_TOKEN: mockedNpmToken,
      NPM_CONFIG_PROVENANCE: "true"
    }
  },
  {
    packageManager: "pnpm",
    expectedCommand: "pnpx",
    expectedArgs: ["@release-change/cli"],
    expectedEnvWithoutNpmToken: {
      RELEASE_TOKEN: mockedGithubToken,
      ISSUE_PR_TOKEN: mockedGithubToken
    },
    expectedEnvWithNpmToken: {
      RELEASE_TOKEN: mockedGithubToken,
      ISSUE_PR_TOKEN: mockedGithubToken,
      NPM_TOKEN: mockedNpmToken,
      NPM_CONFIG_PROVENANCE: "true"
    }
  },
  {
    packageManager: "yarn",
    expectedCommand: "yarn",
    expectedArgs: ["dlx", "@release-change/cli"],
    expectedEnvWithoutNpmToken: {
      RELEASE_TOKEN: mockedGithubToken,
      ISSUE_PR_TOKEN: mockedGithubToken
    },
    expectedEnvWithNpmToken: {
      RELEASE_TOKEN: mockedGithubToken,
      ISSUE_PR_TOKEN: mockedGithubToken,
      NPM_TOKEN: mockedNpmToken,
      YARN_NPM_CONFIG_PROVENANCE: "true"
    }
  }
];
