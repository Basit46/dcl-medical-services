import { defineField, defineType } from "sanity";

export const announcement = defineType({
  name: "announcement",
  title: "Announcement banner",
  type: "document",
  description:
    "Only the newest announcement is used. Turn it off or leave its heading/message blank to hide the website banner.",
  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      description: "A short heading visitors will see.",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      description: "Write the announcement for visitors.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "active",
      title: "Show this announcement",
      type: "boolean",
      initialValue: true,
      description:
        "Turn this off to hide the banner. An older announcement will not return.",
    }),
    defineField({
      name: "duration",
      title: "How long should it show?",
      type: "string",
      initialValue: "7days",
      options: {
        layout: "radio",
        list: [
          { title: "24 hours", value: "24hours" },
          { title: "3 days", value: "3days" },
          { title: "7 days", value: "7days" },
          { title: "1 month", value: "1month" },
          { title: "Indefinitely", value: "indefinite" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "message" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Announcement without a heading",
        subtitle: subtitle || "No message added",
      };
    },
  },
});
