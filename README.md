# Whisk & Crumb

A bakery storefront with a full owner admin dashboard. Portfolio project.

**Live site:** https://whisk-and-crumb.vercel.app/

- **Storefront:** products, categories, gallery, cart with WhatsApp checkout
- **Admin (`/admin`):** password-protected CRUD for products, categories, gallery and business settings, with image upload and crop, drag-and-drop reordering, and a password-change form
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS 4, Supabase (Postgres + Storage), iron-session

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase and session values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run `supabase/schema.sql` in a Supabase project first.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
