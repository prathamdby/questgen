# QuestGen

AI-powered question paper generator for everyone. Upload source materials and generate custom exam papers, quizzes, or study materials with intelligent question design.

## Features

- **AI-Powered Generation**: Uses Google Gemini AI to create questions from any uploaded materials
- **Flexible Pattern Design**: Customizable paper structure for any use case - exams, quizzes, practice tests
- **Multi-format Support**: Accepts PDFs and images as source materials
- **Professional Export**: Generate print-ready PDFs with Apple-inspired design
- **Paper Management**: Organize, search, duplicate, and export generated papers
- **User Authentication**: Secure Google OAuth login with session management

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini API (`@google/genai`)
- **Auth**: Better Auth (Google OAuth)
- **PDF Export**: Client-side browser print with custom styling
- **UI**: Tailwind CSS 4, shadcn/ui components
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Gemini API key
- Google OAuth credentials

### Setup

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd questgen
   bun install
   ```

2. **Environment variables**
    Copy `.env.example` to `.env.local` and fill in your values:

    ```bash
    cp .env.example .env.local
    ```

    Then update `.env.local` with your actual credentials:
    - `DATABASE_URL` and `DIRECT_DATABASE_URL`: PostgreSQL connection strings
    - `GEMINI_API_KEY`: From [Google AI Studio](https://aistudio.google.com/app/apikey)
    - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: From [Google Cloud Console](https://console.cloud.google.com/)
    - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
    - `BETTER_AUTH_URL`: Auth API endpoint (default: `http://localhost:3000/api/auth`)
    - `NEXT_PUBLIC_APP_URL`: Your application URL

3. **Database setup**

   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

4. **Development**
   ```bash
   bun dev
   ```

## Usage

1. **Sign in** with Google OAuth
2. **Create new quest** - configure paper name, pattern, duration, and total marks
3. **Upload materials** - add PDFs or images as source content
4. **Generate** - AI creates questions based on uploaded materials
5. **Export** - download as professionally formatted PDF

## Use Cases

- **Students**: Create practice tests from study materials
- **Educators**: Generate exam papers from textbooks
- **Tutors**: Design custom quizzes for students
- **Parents**: Create study materials for children
- **Professionals**: Generate assessment questions from training materials

## Paper Patterns

Use flexible pattern syntax for any format:

```
Section A: 10 MCQs (20 marks)
Section B: 5 Short Answers (30 marks)
Section C: 3 Long Answers (50 marks)
```

## API Rate Limits

- Paper generation: 2 papers per minute
- General API: 100 requests per minute

## Development

### Database Schema

- `User`: Authentication and preferences
- `Paper`: Generated question papers
- `PaperFile`: Source materials
- `UserPreference`: Theme and view settings

### Key Files

- `app/api/papers/generate/route.ts` - AI generation logic
- `lib/pdf-export-client.ts` - Client-side PDF export with styling
- `lib/auth.ts` - Authentication configuration
- `prisma/schema.prisma` - Database models

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2025 Pratham Dubey
