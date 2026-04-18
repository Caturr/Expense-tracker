# AI Engineering Rulebook

## Project Overview

Expense Tracker is a personal finance dashboard web application.

Current stack:
- Frontend: Vue 3 + Vite + TypeScript + Tailwind + Pinia + Vue Router
- Backend: NestJS + Prisma + PostgreSQL

The app is currently single-user and focused on fast daily expense tracking, account balances, categories, budgets, and dashboard visibility.

The product should feel lightweight, practical, and enjoyable to use daily.

---

## Current Product State

Already implemented or in progress:

- Dashboard page
- Transaction CRUD
- Account CRUD
- Category CRUD
- PostgreSQL persistence
- Prisma migrations
- Summary cards
- Responsive improvements
- UI polish improvements

Next planned phase:

- Authentication
- User ownership of data
- Better reports
- Transfer between accounts
- Telegram / WhatsApp capture bot
- Recurring transactions
- Export features

---

## Core Product Principles

- Fast data entry
- Clear financial visibility
- Clean UI
- Low friction daily usage
- Mobile friendly
- Maintainable codebase
- Small safe iterations

---

## Frontend Rules

Stack:
- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Pinia
- Vue Router

Rules:

- Pages stay thin
- Wrappers handle orchestration and data loading
- Components stay presentational
- Prefer composables for reusable logic
- Keep route definitions clear
- Use strong TypeScript typing
- Keep spacing clean and readable
- Build responsive first
- Prefer icon usage that improves clarity only
- Avoid visual clutter
- Preserve working layouts unless requested

UI Style:

- Clean dashboard look
- Soft colors
- Good spacing
- Strong hierarchy
- Readable tables
- Helpful hover states
- Consistent buttons
- Smooth modal UX

---

## Backend Rules

Stack:
- NestJS
- Prisma
- PostgreSQL

Rules:

- Controllers stay thin
- Services contain business logic
- DTOs stay explicit
- Prisma stays in service/data layer
- Keep schema changes intentional
- Add migrations for schema changes
- Keep modules domain-based
- Avoid unnecessary abstraction
- Keep APIs predictable

---

## Financial Logic Rules

- Balance must reflect account balances correctly
- Income increases account balance
- Expense decreases account balance
- Transfer moves balance between accounts
- Transfer must not change total net worth
- Amounts stored safely and consistently
- UI uses Indonesian currency formatting
- Avoid duplicate transaction side effects
- Deletes and edits must rollback correctly when needed

---

## Folder Structure Rules

Root:
- frontend
- backend
- docs

Frontend:
- pages
- wrappers
- components
- stores
- composables
- router
- types
- utils

Backend:
- modules
- prisma
- common
- config

Keep concerns separated.

---

## Naming Rules

- Domain-first names
- PascalCase for components/classes
- camelCase for variables/functions
- kebab-case for route paths/files when appropriate
- singular entity names
- plural collection names

Examples:
- TransactionsPage.vue
- TransactionForm.vue
- useTransactions.ts
- TransactionsService
- CreateTransactionDto

---

## Refactor Rules

- Prefer minimal changes
- Do not rewrite working code without reason
- Preserve existing APIs unless requested
- Avoid mass file renames
- Explain migrations before changing database schema
- Keep commits/change sets focused

---

## Assistant Guidance

Before editing:
1. Read existing files
2. Understand current architecture
3. Make smallest useful change
4. Keep frontend/backend separation
5. Respect current phase goals

When done:
- summarize changed files
- explain why changes were made
- mention any package installed