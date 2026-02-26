# Eric Roy Music Website

A custom-built Next.js website with admin CMS for managing all content.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
Create a `.env.local` file:
```
NEXTAUTH_SECRET=your-secret-key-change-this-to-something-random
NEXTAUTH_URL=http://localhost:3000
```

### 3. Seed the database
```bash
npm run db:seed
```
This creates the SQLite database with all your current website content and a default admin account:
- **Email:** admin@ericroymusic.com
- **Password:** EricRoy2025!

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Admin Dashboard

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

### Features:
- **Hero Section** - Edit the main hero banner text, background, and call-to-action
- **Music/Singles** - Add, edit, delete music tracks & singles
- **Artists** - Manage featured artists with YouTube/SoundCloud links
- **Blog Posts** - Full blog post CRUD with rich text
- **Site Settings** - Update contact info, social links, newsletter settings
- **Events** - Manage upcoming events and special offers

## Tech Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **SQLite** - Lightweight embedded database
- **NextAuth.js** - Authentication
- **bcryptjs** - Password hashing

## Deployment
```bash
npm run build
npm start
```

The SQLite database file is stored at `./data/ericroymusic.db`.
