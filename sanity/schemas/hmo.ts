import { defineField, defineType } from "sanity";

export const hmo = defineType({
  name: "hmo",
  title: "HMO plan",
  type: "document",
  description:
    "One HMO plan we accept. Each plan is a separate entry so you can add, rename or remove it on its own.",
  orderings: [
    {
      title: "Name, A to Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Plan name",
      description:
        "The exact name of the HMO, as patients will search for it. e.g. AXA Mansard",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare({ title }) {
      return { title: title || "Plan without a name" };
    },
  },
});