# Sanity handover: articles, announcement banner & patient reviews

## Current integration

- Sanity Studio is embedded at `/studio` using `next-sanity` and `sanity`.
- Schema registration is in `sanity/schemas/index.ts`.
- Sanity client/config: `sanity/lib/client.ts`, `sanity.config.ts`, and `sanity.cli.ts`.
- Published article reads and fallback mapping: `sanity/lib/articles.ts`.
- Announcement fetch/expiry: `sanity/lib/announcement.ts`.
- Patient reviews read/write: `sanity/lib/reviews.ts`, `sanity/lib/write-client.ts`, `app/actions.ts`.
- The site-wide announcement modal is rendered by `app/layout.tsx` using `components/site/announcement-banner.tsx` and the shadcn-styled Dialog.
- Studio catch-all route: `app/studio/[[...tool]]/page.tsx`.

## Article editor

The `article` document is intended to be simple for a nontechnical editor. Its visible fields are:

1. Title
2. Article web address (Sanity slug; generate it from the title)
3. Short introduction
4. Publication date
5. Optional main photo
6. Article content (rich text with headings, lists, links, quotes, and inline photos)

Category, reading time, featured toggle, and image alt-text fields are intentionally absent. Article listings use publication date order; the first article is shown in the larger latest-article position. The site requests published articles and falls back to examples in `lib/articles.ts` when Sanity is unconfigured, unreachable, or has no published articles.

## Announcement modal workflow and behavior

The `announcement` schema asks for a heading, message, “Show this announcement” toggle, and duration: 24 hours, 3 days, 7 days, 1 month, or indefinitely. On the site it appears as a centered modal popup, not a strip above the page.

- The newest announcement document (by Sanity `_createdAt`) is authoritative. Older announcements are never used as a fallback.
- If the newest announcement is inactive or either heading/message is blank, no modal is shown.
- Duration begins from the latest published update timestamp (`_updatedAt`). Expired announcements are hidden.
- The latest announcement is checked with a 60-second revalidation interval; the client also hides it when its expiry time arrives while the page remains open.
- Closing the modal hides it for the current page session only. It appears again on reload while the announcement remains active and unexpired. A newer announcement can replace the current modal without a reload.
- To replace a notice, create and publish a new Announcement banner document. To remove the modal, deactivate the newest document or clear its heading/message, then publish that change.

## Patient reviews

The `review` document type captures patient feedback from the landing page.

### Public submission flow

1. Visitors click “Write a review” on the landing page (no login required).
2. A dialog opens with: branch (Ketu / Iju Ishaga), name, 1–5 star rating, and a text review.
3. On submit, a server action (`submitReview` in `app/actions.ts`) validates the data, creates a `review` document in Sanity, and calls `updateTag("sanity:reviews")` so the new review appears immediately (read-your-own-writes).
4. The dialog shows a thank-you message; the review is visible on the page within the 60s revalidation window.
5. Honeypot field (`website`) and server-side validation protect against spam.

### Admin reply (Sanity Studio only)

- Each review document has a single “Reply from the clinic” object field with one text box.
- Open the review in Studio, expand the reply section, write your response, and publish.
- The reply appears under the review on the website with “Reply from Deji Clinic” heading.
- Patients cannot edit their review or reply to the clinic’s response.

### Fallback behaviour

- When Sanity is unconfigured, unreachable, or has no reviews, the section falls back to the three hard-coded testimonials in `lib/clinic.ts`.
- If `SANITY_API_WRITE_TOKEN` is not set, the “Write a review” button is replaced by a note directing patients to call the branch.

### Schema fields (`sanity/schemas/review.ts`)

- **name** (string, required, max 60, read-only in Studio)
- **branch** (string, required, Ketu or Iju Ishaga, read-only)
- **rating** (number, required, integer 1–5, read-only)
- **body** (text, required, max 1200, read-only)
- **reply** (object, optional): body (text, max 600)

Read-only in Studio means editors cannot change the patient's original review — they can only add a reply.

### Read layer (`sanity/lib/reviews.ts`)

- Fetches the 12 newest reviews, ordered by `_createdAt desc`.
- Maps and validates each document; drops malformed ones.
- Computes the average star rating and total count for the section heading.
- Cached with `revalidate: 60` and tag `sanity:reviews`.

### Write layer (`sanity/lib/write-client.ts`)

- Uses `SANITY_API_WRITE_TOKEN` (never a `NEXT_PUBLIC_` variable) with a token that should have **Contributor** role or a custom role limited to `create` on the `review` type. This keeps the token scoped and safe if leaked.
- `reviewsEnabled` boolean tells the UI whether the write path is active.

### Server action (`app/actions.ts`)

- Validates: name ≥ 2 chars, branch is one of the two, rating integer 1–5, review ≥ 20 chars, max 1200.
- Honeypot `website` field: if filled, silently succeeds (no document created).
- On success: `updateTag("sanity:reviews")` for immediate cache invalidation.

## Setup

The Sanity project **is connected** (`NEXT_PUBLIC_SANITY_PROJECT_ID` set in `.env.local`).

### Required environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_WRITE_TOKEN=       # NEW — create a token with Contributor role (create-only) in Sanity API settings
```

Do not put a Sanity editor/write token in any `NEXT_PUBLIC_` variable.

### CORS

- Add `http://localhost:3000` and the deployed site origin in Sanity CORS settings with credentials enabled for Studio sign-in.
- For the write token to work, the same origins must be allowed (or use the token's own origin restrictions if available).

### Studio

1. Restart the app and open `/studio`; sign in.
2. Publish an Article, Announcement banner, or Review.

## Validation / next steps

- Run `npm run lint` and `npm run build` after changes.
- Test `/studio` with a real project ID and authenticated CORS origin.
- Publish two announcements to verify newest-record precedence; test inactive, blank, expiry, and close/dismiss behavior.
- Once real articles are published, remove or replace local examples in `lib/articles.ts` if they should no longer appear when Sanity is empty or unavailable.
- **Reviews**: Create a `SANITY_API_WRITE_TOKEN` in Sanity → API → Tokens with a Contributor/custom role limited to `create` on `review` documents. Add it to `.env.local` and Vercel/Netlify env vars. Verify the “Write a review” button appears and the full flow works end-to-end.
- Verify admin reply workflow: create a review in Studio, add a reply, publish, confirm it shows on the site.

(End of file)