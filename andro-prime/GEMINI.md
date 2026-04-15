# Andro Prime

This repository is the operating structure for the Andro Prime business.

## What this repo contains

- strategy
- brand
- compliance
- products
- partners
- marketing
- sales
- customer journey
- website/app
- launch operations
- post-CQC clinical plugin

## How to work in this repo

### 1. Route to the right workspace first

Each top-level folder has a different purpose. Read the local `CONTEXT.md` before making changes.

### 2. Respect the Phase 0 / post-CQC split

Andro Prime has:

- a non-regulated wellness phase
- a later regulated clinical phase

Do not mix those casually.

### 3. Compliance overrides marketing

If wording, product logic, or funnel design touches claims, diagnosis, privacy, deposits, or regulated language, check the compliance workspace first.

### 4. Frontend has three modes

Inside `09_website-app/frontend`:

- `canonical-site` = trust, organic, browseable pages
- `lp` = direct-response landing pages
- `app` = logged-in user area

Keep them separate.

### 5. Prefer source-of-truth docs over duplicate files

Update the correct document where possible.

## Top-Level Workspaces

- `01_strategy`
- `02_brand`
- `03_compliance`
- `04_products`
- `05_partners`
- `06_marketing`
- `07_sales`
- `08_customer-journey`
- `09_website-app`
- `10_launch-ops`
- `11_clinical-plugin_post_cqc`

## Naming Rules

- use lowercase kebab-case for markdown docs
- use descriptive names
- avoid duplicate versions unless explicitly requested

## Default Approach

For any task:

1. find the correct workspace
2. read `CONTEXT.md`
3. check relevant source docs
4. make changes in the correct place
5. keep outputs structured and maintainable
