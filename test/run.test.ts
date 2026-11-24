import { spawn } from "node:child_process";

import * as core from "@actions/core";
import { getPackageManager } from "@release-change/get-packages";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { run } from "../src/run.js";
import { mockedGithubToken } from "./fixtures/mocked-github-token.js";
import { mockedNpmToken } from "./fixtures/mocked-npm-token.js";
import { mockedReleaseChangeCommands } from "./fixtures/mocked-release-change-commands.js";

const mockedChildProcess = {
  stdout: { on: vi.fn() },
  stderr: { on: vi.fn() },
  on: vi.fn(),
  exitCode: 0
};
const mockedSpawn = spawn as ReturnType<typeof vi.fn>;

vi.mock("node:child_process", () => ({ spawn: vi.fn() }));
vi.mock("@actions/core");
vi.mock("@release-change/get-packages", () => ({
  getPackageManager: vi.fn()
}));

beforeEach(() => {
  mockedSpawn.mockImplementation(() => {
    setTimeout(() => {
      const closeCallback = mockedChildProcess.on.mock.calls.find(call => call[0] === "close")?.[1];
      if (closeCallback) closeCallback(0);
    }, 0);
    return mockedChildProcess;
  });
});

it("should throw an error if no valid package manager is found", async () => {
  vi.mocked(getPackageManager).mockReturnValue(null);
  await expect(run()).rejects.toThrow("No valid package manager found.");
});
describe.each(mockedReleaseChangeCommands)(
  "when the package manager is `$packageManager`",
  ({ packageManager, expectedCommand, expectedArgs }) => {
    beforeEach(() => {
      vi.mocked(getPackageManager).mockReturnValue(packageManager);
    });
    it("should run the `$expectedCommand` command injecting the GitHub token", async () => {
      vi.mocked(core.getInput).mockReturnValueOnce(mockedGithubToken).mockReturnValueOnce("");
      await run();
      expect(spawn).toHaveBeenCalledWith(
        expectedCommand,
        expectedArgs,
        expect.objectContaining({
          env: expect.objectContaining({
            RELEASE_TOKEN: mockedGithubToken,
            ISSUE_PR_TOKEN: mockedGithubToken
          })
        })
      );
      expect(core.setSecret).toHaveBeenCalledWith(mockedGithubToken);
      expect(core.setSecret).not.toHaveBeenCalledWith(mockedNpmToken);
    });
    it("should run the `$expectedCommand` command without injecting the NPM token when it is not provided", async () => {
      vi.mocked(core.getInput).mockReturnValueOnce(mockedGithubToken).mockReturnValueOnce("");
      await run();
      expect(spawn).toHaveBeenCalledWith(
        expectedCommand,
        expectedArgs,
        expect.objectContaining({
          env: expect.not.objectContaining({
            NPM_TOKEN: mockedNpmToken
          })
        })
      );
      expect(core.setSecret).toHaveBeenCalledWith(mockedGithubToken);
      expect(core.setSecret).not.toHaveBeenCalledWith(mockedNpmToken);
    });
    it("should run the `$expectedCommand` command injecting the NPM token when it is provided", async () => {
      vi.mocked(core.getInput)
        .mockReturnValueOnce(mockedGithubToken)
        .mockReturnValueOnce(mockedNpmToken);
      await run();
      expect(spawn).toHaveBeenCalledWith(
        expectedCommand,
        expectedArgs,
        expect.objectContaining({
          env: expect.objectContaining({
            NPM_TOKEN: mockedNpmToken
          })
        })
      );
      expect(core.setSecret).toHaveBeenCalledWith(mockedGithubToken);
      expect(core.setSecret).toHaveBeenCalledWith(mockedNpmToken);
    });
  }
);
