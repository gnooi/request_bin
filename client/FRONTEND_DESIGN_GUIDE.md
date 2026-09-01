# RequestBin Frontend Design Guide

## Purpose

Use the provided PNG design references as the source of truth for implementing the RequestBin frontend.

The goal is to reproduce the provided designs closely in React while keeping the frontend modular and reusable.

---

## Design Analysis

Before writing code, inspect the provided PNGs and determine:

- Approximate page/content width
- Header height
- Major container dimensions
- Left/right column proportions
- Padding and spacing
- Card dimensions
- Typography hierarchy
- Borders
- Border radius
- Shadows
- Alignment
- Responsive behavior that can reasonably be inferred

Do not invent visual details when they can be inferred from the designs.

If an exact value cannot be determined from the PNG, explicitly state that the value is an approximation.

---

## Before Implementing

Before changing code:

1. Inspect the existing React frontend structure.
2. Inspect existing components and CSS.
3. Propose how the design should be divided into React components.
4. Identify which components should be reusable across pages.
5. Identify existing components/styles that can be reused.
6. Provide the proposed component tree.
7. List the files you intend to create or modify.
8. Explain the CSS/layout strategy.
9. Identify any ambiguous parts of the design.

Avoid duplicating functionality or components that already exist.

---

## Implementation Rules

- Use React.
- Keep components focused on clear responsibilities.
- Prefer reusable components over large page components.
- Match the supplied PNG designs as closely as possible.
- Write clean CSS matching the measurements inferred from the designs.
- Do not introduce a new design system.
- Do not invent new colors.
- Do not add features that are not shown in the designs.
- Do not silently change unrelated production code.
- Do not make large structural changes without explaining them first.

---

## Backend Boundary

**DO NOT modify backend code.**

This includes:

- API routes
- Controllers
- Middleware
- PostgreSQL code/schema
- MongoDB code/schema
- Authentication
- Backend tests
- Docker configuration
- Server configuration

Frontend work must remain isolated from the backend unless explicitly instructed otherwise.

---

## Current Branch Scope — Bin Details Layout

For the current branch, focus ONLY on:

### 1. Reusable Header

Create the shared header shown in the designs.

It should be reusable by other RequestBin pages.

### 2. Bin Details Page Structure

Create the structural layout for the Bin Details page, including:

- Overall page/container sizing
- Bin information area
- Left request-list region
- Right request-details region
- Correct spacing and proportions

Placeholder content may be used to establish the layout.

---

## Out of Scope for This Branch

Do NOT implement yet:

- Request cards
- Dummy request dataset
- Request searching
- HTTP method filtering
- Pagination behavior
- Request selection behavior
- Headers/raw request viewer
- API fetching
- React Router changes
- Backend integration

These will be handled in later branches.

---

## Expected Workflow

For each design task:

**Analyze → propose structure → identify files → implement → compare against PNG → refine**

Do not immediately start changing multiple files without first understanding the existing frontend and the supplied design.