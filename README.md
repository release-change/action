# release-change GitHub Action

GitHub Action to run release-change

![License: MIT](https://img.shields.io/github/license/release-change/action)
[![ESM-only package](https://img.shields.io/badge/package-ESM--only-ffe536)](https://nodejs.org/api/esm.html)
[![Conventional Commits 1.0.0](https://img.shields.io/badge/Conventional_Commits-1.0.0-fe5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Released with release-change](https://img.shields.io/badge/Released_with-release--change-8d8d8d)](https://github.com/release-change/release-change)
![Build status](https://img.shields.io/github/actions/workflow/status/release-change/action/run-tests.yml)

This action runs [release-change](https://github.com/release-change/release-change) in a CI environment when any changes in the codebase are pushed to any of the branches on which releases should happen. If a release is made, it then publishes it to NPM, creates a release pull request and comments on the issues and pull requests which are concerned by the release.

## Usage

> [!IMPORTANT]
> It is not recommended to both use this action and install the [release-change GitHub App](https://github.com/apps/release-change): every push to the branches on which releases should happen will trigger two concurrent runs of release-change.

### Workflow examples

Create a workflow file (you can call it `release.yml`) and save it in the `.github/workflows/` directory.

#### With trusted publishing

- using `pnpm`:

      name: Release

      on:
        push:
          branches:
            - main

      permissions:
        contents: read # for checkout

      jobs:
        release:
          name: Release
          runs-on: ubuntu-latest
          permissions:
            contents: write # to be able to publish a GitHub release
            issues: write # to be able to comment on issues
            pull-requests: write # to be able to comment on pull requests
            id-token: write # to enable use of OpenID Connect to publish to NPM with provenance
          steps:
            - name: Checkout
              uses: actions/checkout@v7
              with:
                fetch-depth: 0 # to clone the whole Git history
            - name: Install pnpm and setup Node.js
              uses: pnpm/setup@v3
              with:
                version: 11
                runtime: node@lts
            - name: Install dependencies
              run: pnpm clean-install
            - name: Release and publish to NPM
              uses: release-change/action@v0
- using `yarn`:

      name: Release

      on:
        push:
          branches:
            - main

      permissions:
        contents: read # for checkout

      jobs:
        release:
          name: Release
          runs-on: ubuntu-latest
          permissions:
            contents: write # to be able to publish a GitHub release
            issues: write # to be able to comment on issues
            pull-requests: write # to be able to comment on pull requests
            id-token: write # to enable use of OpenID Connect to publish to NPM with provenance
          steps:
            - name: Checkout
              uses: actions/checkout@v7
              with:
                fetch-depth: 0 # to clone the whole Git history
            - name: Setup Node.js
              uses: actions/setup-node@v6
              with:
                node-version: "lts/*"
            - name: Enable Corepack
              shell: bash
              run: |
                npm install -g corepack
                corepack enable
            - name: Get Yarn cache directory
              id: yarn-cache-dir
              shell: bash
              run: echo "dir=$(yarn config get cacheFolder)" >> "$GITHUB_OUTPUT"
            - name: Get Yarn cache dependencies
              uses: actions/cache@v6
              with:
                path: ${{ steps.yarn-cache-dir.outputs.dir }}
                key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
                restore-keys: |
                  ${{ runner.os }}-yarn-
            - name: Install dependencies
              run: yarn install --immutable
            - name: Release and publish to NPM
              uses: release-change/action@v0
- using `npm`:

      name: Release

      on:
        push:
          branches:
            - main

      permissions:
        contents: read # for checkout

      jobs:
        release:
          name: Release
          runs-on: ubuntu-latest
          permissions:
            contents: write # to be able to publish a GitHub release
            issues: write # to be able to comment on issues
            pull-requests: write # to be able to comment on pull requests
            id-token: write # to enable use of OpenID Connect to publish to NPM with provenance
          steps:
            - name: Checkout
              uses: actions/checkout@v7
              with:
                fetch-depth: 0 # to clone the whole Git history
            - name: Setup Node.js
              uses: actions/setup-node@v6
              with:
                node-version: "lts/*"
                cache: "npm"
            - name: Install dependencies
              run: npm clean-install
            - name: Release and publish to NPM
              uses: release-change/action@v0
#### Without trusted publishing

- using `pnpm`:

      name: Release

      on:
        push:
          branches:
            - main

      permissions:
        contents: read # for checkout

      jobs:
        release:
          name: Release
          runs-on: ubuntu-latest
          permissions:
            contents: write # to be able to publish a GitHub release
            issues: write # to be able to comment on issues
            pull-requests: write # to be able to comment on pull requests
          steps:
            - name: Checkout
              uses: actions/checkout@v7
              with:
                fetch-depth: 0 # to clone the whole Git history
            - name: Install pnpm and setup Node.js
              uses: pnpm/setup@v3
              with:
                version: 11
                runtime: node@lts
            - name: Install dependencies
              run: pnpm clean-install
            - name: Release and publish to NPM
              uses: release-change/action@v0
              env:
                NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
                NPM_CONFIG_PROVENANCE: true # to be able to publish to NPM with provenance
- using `yarn`:

      name: Release

      on:
        push:
          branches:
            - main

      permissions:
        contents: read # for checkout

      jobs:
        release:
          name: Release
          runs-on: ubuntu-latest
          permissions:
            contents: write # to be able to publish a GitHub release
            issues: write # to be able to comment on issues
            pull-requests: write # to be able to comment on pull requests
          steps:
            - name: Checkout
              uses: actions/checkout@v7
              with:
                fetch-depth: 0 # to clone the whole Git history
            - name: Setup Node.js
              uses: actions/setup-node@v6
              with:
                node-version: "lts/*"
            - name: Enable Corepack
              shell: bash
              run: |
                npm install -g corepack
                corepack enable
            - name: Get Yarn cache directory
              id: yarn-cache-dir
              shell: bash
              run: echo "dir=$(yarn config get cacheFolder)" >> "$GITHUB_OUTPUT"
            - name: Get Yarn cache dependencies
              uses: actions/cache@v6
              with:
                path: ${{ steps.yarn-cache-dir.outputs.dir }}
                key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
                restore-keys: |
                  ${{ runner.os }}-yarn-
            - name: Install dependencies
              run: yarn install --immutable
            - name: Release and publish to NPM
              uses: release-change/action@v0
              env:
                NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
                NPM_CONFIG_PROVENANCE: true # to be able to publish to NPM with provenance
- using `npm`:

      name: Release

      on:
        push:
          branches:
            - main

      permissions:
        contents: read # for checkout

      jobs:
        release:
          name: Release
          runs-on: ubuntu-latest
          permissions:
            contents: write # to be able to publish a GitHub release
            issues: write # to be able to comment on issues
            pull-requests: write # to be able to comment on pull requests
          steps:
            - name: Checkout
              uses: actions/checkout@v7
              with:
                fetch-depth: 0 # to clone the whole Git history
            - name: Setup Node.js
              uses: actions/setup-node@v6
              with:
                node-version: "lts/*"
                cache: "npm"
            - name: Install dependencies
              run: npm clean-install
            - name: Release and publish to NPM
              uses: release-change/action@v0
              env:
                NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
                NPM_CONFIG_PROVENANCE: true # to be able to publish to NPM with provenance
## Get help

- [Stack Overflow](https://stackoverflow.com/questions/tagged/release-change)

## Copyright & licence

© 2026 Victor Brito — Released under the [MIT licence](./LICENSE).
