#!/usr/bin/env node
import childProcess from "child_process";
import fs from "fs";
import path from "path";
import { Command } from "commander";
import { z } from "zod";

const program = new Command();

const packageJsonPath = path.join(__dirname, "../package.json");
const packageJsonSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
});
const packageJsonText = fs.readFileSync(packageJsonPath, "utf-8");
const packageJson = packageJsonSchema.parse(JSON.parse(packageJsonText));
program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

program
  .command("artifactory")
  .description("Adds an artifactory registry")
  .argument("<url>")
  .argument("<email>")
  .argument("<api key>")
  .option("--scope <scope>")
  .option("--location <location>", "passed to `npm config`", "user")
  .action(artifactory);

program.parse();

async function artifactory(
  url: string,
  email: string,
  apiKey: string,
  { scope, location }: { scope?: string; location: string }
) {
  const sanitized = scope && !scope.startsWith("@") ? `@${scope}` : scope;
  const registryKey = sanitized ? `${sanitized}:registry` : "registry";
  await setConfig(registryKey, url, location);

  const protocolRelative = url.substring(url.indexOf("//"));
  await setConfig(`${protocolRelative}:email`, email, location);

  const token = Buffer.from(`${email}:${apiKey}`).toString("base64");
  await setConfig(`${protocolRelative}:_auth`, token, location);
}

async function setConfig(key: string, value: string, location: string) {
  await exec(["npm", "config", "set", key, value, "--location", location]);
}

function exec(command: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    childProcess
      .spawn(command[0], command.slice(1))
      .on("close", (code) => {
        if (code) throw new Error(`Unexpected exit code: ${code}`);
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
