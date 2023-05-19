#!/usr/bin/env node
import childProcess from "child_process";
import fs from "fs";
import { join as joinPath } from "path";
import { Command } from "commander";
import { z } from "zod";

const packageJsonSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
});

const packageJson = (() => {
  const path = joinPath(__dirname, "../package.json");
  const text = fs.readFileSync(path, "utf-8");
  return packageJsonSchema.parse(JSON.parse(text));
})();

const program = new Command();
program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

program
  .command("artifactory")
  .description("Configures npm to use an artifactory registry.")
  .argument("<url>")
  .argument("<email>")
  .argument("<api key>")
  .option("--scope <scope>", "e.g. @airbnb")
  .option("--location <location>", "passed to `npm config`", "user")
  .action(
    async (
      url: string,
      email: string,
      apiKey: string,
      { scope, location }: { scope?: string; location: string }
    ) => {
      await exec(
        "npm",
        "config",
        "set",
        typeof scope === "string" ? `${scope}:registry` : "registry",
        url,
        "--location",
        location
      );

      await exec(
        "npm",
        "config",
        "set",
        `${url.substring(url.indexOf("//"))}:email`,
        email,
        "--location",
        location
      );

      await exec(
        "npm",
        "config",
        "set",
        `${url.substring(url.indexOf("//"))}:_auth`,
        Buffer.from(`${email}:${apiKey}`).toString("base64"),
        "--location",
        location
      );
    }
  );

program.parse();

function exec(command: string, ...args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    childProcess
      .spawn(command, args)
      .on("close", (code) => {
        if (code) throw new Error(`Unexpected exit code: ${code}`);
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
