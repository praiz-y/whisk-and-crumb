# Whisk & Crumb

A website and admin dashboard built for a small bakery business, designed so a non-technical owner can run it herself without a developer.

**Live site:** https://whisk-and-crumb.vercel.app/

## The problem

The bakery's product details, prices, photos and contact info were hardcoded, so every change meant a developer editing code and redeploying. The owner needed to update the site herself, at any time, without touching code.

## What it does

**Storefront**
- Browse products by category, with a featured selection on the homepage
- Photo gallery, FAQs and testimonials
- Cart with WhatsApp checkout: the order is sent to the owner as a pre-filled chat message

**Owner dashboard (`/admin`)**
- Password-protected, with a self-service password change
- Add, edit, delete and reorder products, categories and gallery images (drag and drop)
- Upload and crop photos in the browser
- Edit contact details and social links
- A dashboard that flags anything needing attention
- Changes appear on the live site within about a minute

## Built with

Next.js (App Router), TypeScript, Tailwind CSS 4, Supabase (Postgres and Storage), iron-session

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase and session values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run `supabase/schema.sql` in a Supabase project first.

## Scripts

- `npm run dev`: development server
- `npm run build`: production build
- `npm run lint`: ESLint
