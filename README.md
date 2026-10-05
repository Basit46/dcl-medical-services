# DCL Medical Services website

## Articles and Sanity Studio

The article section is connected to Sanity and supports an embedded editorial studio at `/studio`.

### 1. Create a Sanity project

Create a project in the [Sanity management console](https://www.sanity.io/manage), then note its project ID and dataset name. The default dataset name is `production`.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — the project ID from Sanity.
- `NEXT_PUBLIC_SANITY_DATASET` — usually `production`.
- `NEXT_PUBLIC_SANITY_API_VERSION` — the API version date; the checked-in default is `2025-02-19`.

Project ID and dataset are public identifiers, not secrets. Published articles can be read without a token when the dataset is public. Do not put an editor token in a `NEXT_PUBLIC_` variable.

In the Sanity project settings, add the local site origin (`http://localhost:3000`) and your deployed site origin to the project's CORS origins. Enable credentials for these origins so editors can sign in to the embedded Studio.

### 3. Start the website and Studio

Run `npm run dev`, open the site, then visit `/studio`. Sign in with a Sanity account that has access to the configured project. From the Studio, create and publish Article documents.

The Article form is kept simple: title, short introduction, publication date, optional main photo, and article content. The article address is generated from its title. Category, reading time, and image alt-text fields are not required from the editor.

The Announcement banner form only asks for a heading, message, whether it should show, and how long it should remain visible (24 hours, 3 days, 7 days, 1 month, or indefinitely). On the site it appears as a modal popup. The newest announcement replaces all older ones. Turn off the newest announcement or leave its heading/message empty to show no popup; older announcements will not reappear. Visitors can close the popup for the current page session; it appears again on reload while still active.

### 4. Publishing behavior

The public article index and detail pages query published Sanity articles. The newest active announcement is checked site-wide. Content is cached for 60 seconds. If Sanity is not configured, temporarily unavailable, or has no published articles yet, the current local example articles remain visible. Remove or update those examples in `lib/articles.ts` when the Sanity dataset has the intended launch content.

### Project commands

- `npm run dev` — start local development.
- `npm run lint` — run ESLint.
- `npm run build` — create a production build.
