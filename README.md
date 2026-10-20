# Reset

Karam's training, food and habit plan, with a daily log, toward Burj2Burj (24 January 2027) and 91–93 kg.

## What's where

| File | What it does |
|---|---|
| `index.html` | The page skeleton: header, tabs, and an empty area the app fills in |
| `css/style.css` | All colours, fonts and layout |
| `js/plan.js` | **The plan itself** — every walk-run, session, meal, rule. Change the plan here. |
| `js/app.js` | Draws each screen (Today, Log, Plan, Food, Progress) and builds the weekly report |
| `js/store.js` | Saves and loads logs (Supabase, or this browser in test mode) |
| `js/config.js` | The two Supabase connection values |
| `supabase/schema.sql` | Creates the `logs` table and the rule that only you can read your rows |
| `print.html` | One-page printable rules sheet |

There is no build step: these files are served exactly as they are.

## Setup (once)

1. **Supabase → SQL Editor → New query**: paste `supabase/schema.sql`, click **Run**.
2. **Supabase → Project Settings → API**: copy the *Project URL* and the *anon / publishable* key into `js/config.js`.
3. **Vercel → Add New → Project**: import this GitHub repo. Framework preset: **Other**. No build command. Deploy.
4. Open the site, choose **Create the account**, sign in.
5. **Supabase → Authentication → Sign In / Providers → Email**: turn off **Allow new users to sign up**, so nobody else can make an account.
6. **Supabase → Authentication → URL Configuration**: set *Site URL* to your Vercel address.

## Changing things

- Edit a file on GitHub (pencil icon) → **Commit changes**. Vercel republishes the site in about a minute.
- Want to try it on your own computer first? In this folder run `python3 -m http.server 8000` and open http://localhost:8000.

## Weekly routine

Sunday evening: Progress tab → **Copy report for Claude** → paste into the Claude chat. We adjust the next week from it.
