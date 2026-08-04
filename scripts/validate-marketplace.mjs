#!/usr/bin/env node
/**
 * Structural validation for the Antioch Skills marketplace.
 * Verifies .claude-plugin/marketplace.json and every plugin/skill it references.
 * Exits non-zero on any problem so CI can gate merges.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    errors.push(`${path}: invalid JSON - ${e.message}`);
    return null;
  }
}

const manifestPath = join(root, ".claude-plugin", "marketplace.json");
if (!existsSync(manifestPath)) {
  console.error("FAIL: missing .claude-plugin/marketplace.json");
  process.exit(1);
}

const mp = readJson(manifestPath);
if (mp) {
  if (typeof mp.name !== "string" || !mp.name.trim())
    errors.push("marketplace.json: missing string `name`");
  if (!mp.owner || typeof mp.owner.name !== "string")
    errors.push("marketplace.json: missing `owner.name`");
  if (!Array.isArray(mp.plugins) || mp.plugins.length === 0)
    errors.push("marketplace.json: `plugins` must be a non-empty array");

  const pluginRoot = mp.metadata?.pluginRoot ?? ".";
  const seen = new Set();

  for (const entry of Array.isArray(mp.plugins) ? mp.plugins : []) {
    const label = entry?.name ?? "(unnamed)";
    if (!entry?.name) {
      errors.push("plugin entry: missing `name`");
      continue;
    }
    if (seen.has(entry.name)) errors.push(`duplicate plugin name: ${entry.name}`);
    seen.add(entry.name);
    if (!entry.source) errors.push(`${label}: missing \`source\``);

    const pluginDir = resolve(root, pluginRoot, entry.source ?? "");
    if (!existsSync(pluginDir)) {
      errors.push(`${label}: source dir not found - ${entry.source}`);
      continue;
    }

    const pj = join(pluginDir, ".claude-plugin", "plugin.json");
    if (!existsSync(pj)) {
      errors.push(`${label}: missing .claude-plugin/plugin.json`);
    } else {
      const manifest = readJson(pj);
      if (manifest) {
        if (!manifest.name) errors.push(`${label}: plugin.json missing \`name\``);
        else if (manifest.name !== entry.name)
          errors.push(
            `${label}: plugin.json name "${manifest.name}" != marketplace name "${entry.name}"`
          );
      }
    }

    const skillsDir = join(pluginDir, "skills");
    let skills = 0;
    if (existsSync(skillsDir)) {
      for (const name of readdirSync(skillsDir)) {
        const dir = join(skillsDir, name);
        if (statSync(dir).isDirectory() && existsSync(join(dir, "SKILL.md"))) skills++;
      }
    }
    if (skills === 0) errors.push(`${label}: no skills/*/SKILL.md found`);
    else console.log(`  ok  ${entry.name} - ${skills} skill(s)`);
  }
}

if (errors.length) {
  console.error(`\nFAIL: ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`\nOK: marketplace valid - ${mp.plugins.length} plugin(s)`);
