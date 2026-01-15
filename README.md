# Blog CMS Platform

A full-stack blog platform built with Next.js, Express, and MongoDB.

## Architecture Overview

### Backend Architecture (Express + MongoDB)

**Structure:**
```
backend/
├── config/          # Database configuration
├── models/          # Mongoose models (User, Post)
├── routes/          # API route handlers
├── middleware/      # Authentication middleware
└── server.js        # Express server entry point
```

**Key Components:**
- **RESTful API**: Clean separation of concerns with routes, models, and middleware
- **Authentication**: JWT-based auth with bcryptjs password hashing
- **Database**: MongoDB with Mongoose ODM for schema validation
- **Validation**: express-validator for request validation
- **Security**: Password hashing, JWT tokens, protected routes

**API Structure:**
- `/api/auth/*` - Authentication endpoints (public)
- `/api/posts/*` - Blog post CRUD (protected with auth middleware)
- `/api/posts/public/*` - Public blog post endpoints (no auth required)

### Frontend Architecture (Next.js 14)

**Structure:**
```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard (protected)
│   ├── blog/[slug]/       # Dynamic blog post pages (SEO-optimized)
│   └── page.tsx           # Home page with blog listing
├── components/            # Reusable React components
├── lib/                   # Utilities and API clients
└── public/                # Static assets
```

**Key Features:**
- **Server Components**: Home page and blog posts use server-side rendering for SEO
- **Client Components**: Admin dashboard uses client-side rendering for interactivity
- **Dynamic Routes**: `/blog/[slug]` with automatic slug generation
- **SEO Optimization**: Dynamic metadata generation, Open Graph tags
- **Markdown Support**: react-markdown with syntax highlighting
- **Protected Routes**: Client-side route protection for admin pages

## Features

- ✅ Admin authentication (login/register)
- ✅ CRUD operations for blog posts
- ✅ Markdown support for content
- ✅ SEO-friendly dynamic routes
- ✅ Clean API structure

## Setup

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local file (optional, defaults to http://localhost:5000)
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Frontend runs on `http://localhost:3000`

**Note:** Make sure MongoDB is running and the backend server is started before running the frontend.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin

### Blog Posts (Protected)
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Public
- `GET /api/posts/public` - Get published posts
- `GET /api/posts/public/:slug` - Get post by slug

## Code Quality

- **Clean Code**: Well-organized file structure with separation of concerns
- **Type Safety**: TypeScript for frontend, JSDoc comments for backend
- **Error Handling**: Comprehensive error handling in API routes
- **Validation**: Input validation on both client and server
- **Security**: Password hashing, JWT authentication, protected routes

## Project Structure

```
admin-cms/
├── backend/
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── server.js       # Entry point
├── frontend/
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   └── lib/            # Utilities
└── README.md
```
# admin-cms
