import type { ReleaseChangeEnv } from "./types.js";

import { spawn } from "node:child_process";

import * as core from "@actions/core";
import { getPackageManager } from "@release-change/get-packages";

/**
 * Runs release-change.
 */
export const run = async (): Promise<void> => {
  const packageManager = getPackageManager(process.cwd(), process.env);
  const githubToken = core.getInput("github-token");
  const npmToken = core.getInput("npm-token");
  const command =
    packageManager === "pnpm"
      ? "pnpx"
      : packageManager === "yarn"
        ? packageManager
        : packageManager === "npm"
          ? "npx"
          : null;
  const args = ["@release-change/cli"];
  if (packageManager === "yarn") args.unshift("dlx");
  await new Promise<void>((resolve, reject) => {
    if (command) {
      core.setSecret(githubToken);
      const { PRIVATE_KEY, WEBHOOK_SECRET, ...inheritedEnv } = process.env;
      const additionalEnv: ReleaseChangeEnv = {
        RELEASE_TOKEN: githubToken,
        ISSUE_PR_TOKEN: githubToken,
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: `url.https://x-access-token:${githubToken}@github.com/.insteadOf`,
        GIT_CONFIG_VALUE_0: "https://github.com/"
      };
      if (npmToken) {
        core.setSecret(npmToken);
        additionalEnv.NPM_TOKEN = npmToken;
      }
      const childProcess = spawn(command, args, {
        cwd: process.cwd(),
        env: {
          ...inheritedEnv,
          ...additionalEnv
        },
        stdio: ["ignore", "inherit", "inherit"]
      });
      childProcess.on("error", reject);
      childProcess.on("close", code => {
        if (code) reject(new Error(`release-change exited with code ${code}.`));
        else resolve();
      });
    } else reject(new Error("No valid package manager found."));
  });
};
