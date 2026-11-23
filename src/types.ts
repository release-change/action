export type ReleaseChangeEnv = {
  RELEASE_TOKEN: string;
  ISSUE_PR_TOKEN: string;
  GIT_CONFIG_COUNT: "1";
  GIT_CONFIG_KEY_0: `url.https://x-access-token:${string}@github.com/.insteadOf`;
  GIT_CONFIG_VALUE_0: "https://github.com/";
  NPM_TOKEN?: string;
  NPM_CONFIG_PROVENANCE?: "true";
  YARN_NPM_CONFIG_PROVENANCE?: "true";
};
