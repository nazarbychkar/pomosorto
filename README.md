# Pomosorto
## Pomodoro Timer with Custom Productivity Metrics

This is a **Pomodoro timer** where you can define and track your own productivity metrics.

The idea is simple: you may want to measure how different **actions** (or **inactions**) affect your productivity. This tool helps you do just that — giving you a flexible way to experiment, reflect, and optimize how you work.

## Tech Stack Choice

I've chosen to use a combination of **PostgreSQL** _(to store structured data)_ and **MongoDB** _(to store flexible data)_ — mostly because I wanted to give Mongo a shot.

Would it have been neater, smarter, and simpler to stick with **PostgreSQL's JSONB**? Probably.  
But hey, maybe next time.

## .env 

You'll need:

```
AUTH_SECRET="blahblahblah"
AUTH_GOOGLE_ID="blahblahblah"
AUTH_GOOGLE_SECRET="blahblahblah"
DATABASE_URL="blahblahblah"
MONGODB_ATLAS_URL="blahblahblah"
```

# Notes from Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
