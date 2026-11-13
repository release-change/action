import packageManifest from "../package.json" with { type: "json" };

console.log(`Using release-change/action ${packageManifest.version}`);
