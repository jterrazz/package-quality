#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findProjectRoot() {
  let dir = process.cwd();
  if (dir.includes("node_modules")) {
    dir = dir.split("node_modules")[0];
  }
  return dir;
}

// Rule mappings based on extended configs
const ruleMappings = [
  {
    pattern: "architectures/hexagonal",
    rule: ["codestyle/arch-hexagonal", "error"],
  },
  {
    pattern: "oxlint/node",
    rule: ["codestyle/imports-with-ext", "error"],
  },
  {
    pattern: "oxlint/expo",
    rule: ["codestyle/imports-without-ext", "error"],
  },
  {
    pattern: "oxlint/nextjs",
    rule: ["codestyle/imports-without-ext", "error"],
  },
];

function run() {
  const projectRoot = findProjectRoot();
  const configPath = path.join(projectRoot, ".oxlintrc.json");

  if (!fs.existsSync(configPath)) {
    return;
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    console.log("[@jterrazz/codestyle] Could not parse .oxlintrc.json");
    return;
  }

  const configStr = JSON.stringify(config);
  const neededRules = new Map();
  let needsPlugin = false;

  for (const mapping of ruleMappings) {
    if (configStr.includes(mapping.pattern)) {
      neededRules.set(mapping.rule[0], mapping.rule[1]);
      needsPlugin = true;
    }
  }

  if (!needsPlugin) {
    return;
  }

  let updated = false;
  const updates = [];

  // Add plugin
  const pluginPath = "./node_modules/@jterrazz/codestyle/src/oxlint/plugins/codestyle.js";
  config.jsPlugins = config.jsPlugins || [];
  if (!config.jsPlugins.includes(pluginPath)) {
    config.jsPlugins.push(pluginPath);
    updated = true;
    updates.push("  + jsPlugins: codestyle.js");
  }

  // Add rules
  config.rules = config.rules || {};
  for (const [ruleName, ruleLevel] of neededRules) {
    if (!config.rules[ruleName]) {
      config.rules[ruleName] = ruleLevel;
      updated = true;
      updates.push(`  + rule: ${ruleName}`);
    }
  }

  if (!updated) {
    return;
  }

  fs.writeFileSync(
    configPath,
    `${JSON.stringify(config, null, 2)}
`,
  );

  console.log("[@jterrazz/codestyle] Updated .oxlintrc.json:");
  for (const update of updates) {
    console.log(update);
  }
}

run();
