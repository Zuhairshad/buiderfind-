# BuilderFind

BuilderFind is a UK hirer-to-trades marketplace built with Next.js 16, MongoDB Atlas and JWT cookie sessions. Hirers can post jobs, compare up to three quotes, book work, message builders and publish completion-gated reviews. Verified builders receive location-aware leads, quote and manage booked work. Admins moderate verification, accounts and launch-time commercial feature flags.

## Local setup

Requirements: Node.js 22 or newer, npm, and a MongoDB Atlas deployment configured as a replica set (transactions and Change Streams are used). Vercel currently runs Node.js 24 by default.

1. Copy `.env.example` to `.env.local` and add the core Mongo/JWT values.
2. Create two independent secrets of at least 32 characters for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
3. Install packages with `npm install`.
4. Create database indexes and disabled launch flags with `npm run db:indexes`.
5. Create or rotate the first admin with `npm run admin:create` after adding the two admin bootstrap variables.
6. Run `npm run dev` for normal UI/API work, or `npm run dev:realtime` to exercise Vercel's WebSocket upgrade locally.

The core account and marketplace routes need MongoDB and JWT values. Uploads return an explicit `503` until Vercel Blob is configured. Email and SMS remain recorded as `provider_missing` until Resend or Twilio credentials are added; in-app notifications still work.

## Services

- MongoDB Atlas stores users, sessions, profiles, jobs, quotes, bookings, messages, reviews, notifications, audit logs, realtime events and feature flags.
- Vercel Blob stores private job/verification/message files and public portfolio/avatar media.
- Resend sends password resets and opted-in email alerts.
- Twilio sends opted-in SMS lead alerts.
- Vercel Functions host the Node.js APIs and the authenticated WebSocket route. MongoDB Change Streams fan durable events into connected dashboards; dashboards also poll every 30 seconds as a fallback.

No provider is provisioned or deployed by this repository. Credentials activate the adapters already in code.

## Commands

```bash
npm run dev
npm run dev:realtime
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
npm run db:indexes
npm run admin:create
```

## Vercel

The repository is linked locally to the `builderfind` Vercel project, but deployment is intentionally not performed by setup. Add the values from `.env.example` to the appropriate Vercel environments, allow Atlas network access for Vercel Functions, run the index/admin setup once against the intended database, then deploy through the approved workflow.

The locally installed Vercel CLI was `52.0.0`; Vercel currently recommends `59.1.3` or newer. Upgrade before using `vercel dev` or deployment commands:

```bash
npm i -g vercel@latest
```

## Security model

- Access JWTs expire after 15 minutes; rotating refresh sessions are stored server-side and expire after 30 days (or 24 hours when “remember me” is off).
- Tokens use separate secrets, HttpOnly cookies, `SameSite=Lax`, secure production cookies, issuer/audience checks, refresh-token reuse detection and token-version invalidation.
- Mutation routes validate same-origin requests and Zod payloads; login/reset attempts use Mongo-backed rate limits.
- Public listings expose verified, visible builder profiles only. Private Blob content is authorised through application routes.
- Payments, lead charging, subscriptions, featured placements and booking fees ship disabled. They require separate provider and product approval before activation.
