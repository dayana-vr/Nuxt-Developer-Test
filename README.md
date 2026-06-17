# Nuxt Product Management App

A full-stack application built with Nuxt, Prisma, and PostgreSQL for product management.

---

## Stack

- Nuxt 4
- TypeScript
- Prisma ORM
- PostgreSQL
- Faker (@faker-js/faker)

---

## Installation

npm install

---

## Prisma Setup

npx prisma generate
npx prisma db push

---

## Seed Database

npx prisma db seed

---

## Run Project

npm run dev

---

## Environment Variables

DATABASE_URL="postgresql://user:password@localhost:5432/nuxt_test?schema=public"

---

## Features

### Public Frontend

- Product listing with pagination
- Only products with isPublic: true are shown
- Product detail page
- Search by name
- Filters by category and price range

---

### Admin Panel

- Full CRUD for products
- Table view of all products
- Create and edit modal
- Delete confirmation
- Visibility control (isPublic)
- Pagination

---

## API Endpoints

- GET /api/products → list products with filters and pagination
- GET /api/products/:id → product detail
- POST /api/products → create product
- PATCH /api/products/:id → update product
- DELETE /api/products/:id → delete product

---

## Data Model

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  stock       Int
  category    String
  imageUrl    String?
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

---

## Routes

### Public

- / → product listing
- /products/[id] → product detail page

### Admin

- /admin/products → product management

---

## Technical Notes

- Architecture based on composables
- Nuxt server API routes
- Prisma ORM layer
- Fully typed with TypeScript
- Backend filtering logic
- Complete CRUD implementation
