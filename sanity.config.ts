"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

export const studioBasePath = "/studio";

const config = defineConfig({
  name: "dcl-content-studio",
  title: "DCL Medical Services",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dclmedical",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: studioBasePath,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});

export default config;
