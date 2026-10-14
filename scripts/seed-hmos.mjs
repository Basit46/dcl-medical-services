import { readFile, writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

const source = await readFile("lib/clinic.ts", "utf8");
const block = source.match(/export const hmoPlans = \[([\s\S]*?)\n\];/);
if (!block) throw new Error("Could not find hmoPlans in lib/clinic.ts");

const plans = [...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

const toId = (name) =>
  `hmo.${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required");

let missing = plans;

if (token) {
  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-02-19",
    useCdn: false,
  });

  try {
    const existing = await client.fetch(`*[_type == "hmo"]{name}`);
    const present = new Set(
      existing.map((doc) => (doc.name || "").trim().toLowerCase()),
    );
    missing = plans.filter((name) => !present.has(name.toLowerCase()));

    if (!missing.length) {
      console.log(`All ${plans.length} plans already exist in ${projectId}/${dataset}.`);
      process.exit(0);
    }

    const transaction = client.transaction();
    for (const name of missing) {
      transaction.createIfNotExists({ _id: toId(name), _type: "hmo", name });
    }
    await transaction.commit();
    console.log(`Created ${missing.length} HMO documents in ${projectId}/${dataset}.`);
    process.exit(0);
  } catch (error) {
    console.warn(`Direct write failed: ${error.message}`);
    console.warn("Falling back to an NDJSON import file.\n");
  }
}

const lines = missing.map((name) =>
  JSON.stringify({ _id: toId(name), _type: "hmo", name }),
);
await writeFile("data/hmo-plans.ndjson", `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${missing.length} documents to data/hmo-plans.ndjson`);
console.log(`Import with: npx sanity dataset import data/hmo-plans.ndjson ${dataset}`);