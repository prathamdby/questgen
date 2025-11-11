import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service & Privacy Policy | QuestGen",
  description:
    "Legal documentation covering data handling, third-party integrations, and user rights.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            ← Back to QuestGen
          </Link>
        </div>

        <header className="mb-16">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Introduction
            </h2>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              This document maps every technical reality of QuestGen to legal
              requirements. We disclose data handling patterns that traditional
              privacy policies miss. Every API endpoint, database field, and
              third-party integration is accounted for here.
            </p>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              By using QuestGen, you acknowledge that you have read, understood,
              and agree to be bound by these terms. If you do not agree, do not
              use our service.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Data We Collect
            </h2>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Authentication Data
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              When you sign in with Google OAuth, we collect and store the
              following in our PostgreSQL database:
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>User account data:</strong> Your name (required by
                Better Auth), email address (unique identifier), profile image
                URL (optional), and email verification status.
              </li>
              <li>
                <strong>OAuth tokens:</strong> We store access tokens, refresh
                tokens, and ID tokens from Google in our Account table. These
                tokens enable session management and may be refreshed
                automatically. Token expiration dates are tracked.
              </li>
              <li>
                <strong>Session data:</strong> Every authenticated session
                creates a record containing a unique token, expiration
                timestamp, IP address (optional), and user agent string
                (optional). Sessions expire after 7 days of inactivity, with
                automatic refresh every 24 hours.
              </li>
            </ul>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Content Data
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              When you generate question papers, we store:
            </p>
            <ul className="mb-6 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>Paper metadata:</strong> Title, pattern specification,
                duration, total marks, generation status (IN_PROGRESS or
                COMPLETED), and timestamps.
              </li>
              <li>
                <strong>Paper content:</strong> The full Markdown content of
                generated question papers is stored in our database as text.
              </li>
              <li>
                <strong>File metadata:</strong> For each uploaded file, we store
                the original filename, file size in bytes, MIME type, and upload
                timestamp. The actual file content is never stored in our
                database. Instead, files are temporarily uploaded to Google
                Gemini API for processing, then deleted immediately after
                generation completes.
              </li>
              <li>
                <strong>Solution content:</strong> If you request companion
                solutions, the generated solution Markdown is stored separately
                with its own status and timestamps.
              </li>
            </ul>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Usage Data
            </h3>
            <ul className="mb-6 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>User preferences:</strong> Theme selection (LIGHT, DARK,
                SYSTEM) and view mode (CARD, LIST) are stored and persist across
                sessions.
              </li>
              <li>
                <strong>Form drafts:</strong> The generate page auto-saves draft
                form data (paper name, pattern, duration, total marks) to
                prevent data loss. This data is stored without a foreign key
                relationship to simplify cleanup, which means orphaned drafts
                may persist if user accounts are deleted through external means.
              </li>
              <li>
                <strong>Rate limiting data:</strong> Request counts and
                timestamps are stored in our RateLimit table to enforce API
                limits (2 papers per minute for generation endpoints, 100
                requests per minute globally).
              </li>
              <li>
                <strong>Verification tokens:</strong> Email verification and
                password reset tokens are stored temporarily with expiration
                timestamps.
              </li>
            </ul>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Technical Metadata
            </h3>
            <ul className="mb-6 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>IP addresses:</strong> Session records may include your
                IP address for security and rate limiting purposes. This is
                optional and may be null.
              </li>
              <li>
                <strong>User agent strings:</strong> Browser and device
                information may be stored with sessions for compatibility
                tracking.
              </li>
              <li>
                <strong>Analytics:</strong> Vercel Analytics automatically
                collects page views and performance metrics. This occurs without
                explicit consent banners, as it is considered essential for
                service operation.
              </li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Third-Party Services
            </h2>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Google OAuth
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Authentication is handled by Google OAuth 2.0. When you sign in,
              Google shares your profile information (name, email, profile
              image) according to their privacy policy. We store OAuth tokens in
              our database to maintain your session. These tokens grant us
              access to your basic Google profile information only. We do not
              access your Google Drive, Gmail, or any other Google services.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Google Gemini API
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Question papers and solutions are generated using Google Gemini
              Flash. When you upload files, they are temporarily uploaded to
              Gemini's servers for processing. File URIs are stored in memory
              during generation, then immediately deleted after processing
              completes. File metadata (name, size, MIME type) persists in our
              database even after Gemini deletion, as it is needed for paper
              history and export functionality. The actual file content is never
              stored in our database.
            </p>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Gemini processes your uploaded materials according to Google's AI
              Principles and their API terms of service. Generated content is
              derived solely from your uploaded materials. We do not train
              models on your content, but Google may use API interactions for
              service improvement per their terms.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Vercel Analytics
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Vercel Analytics is embedded in our application layout and
              automatically collects anonymized usage metrics. This includes
              page views, performance data, and error rates. No personal
              identification information is included in analytics data. This
              service operates without explicit consent banners as it is
              considered essential infrastructure.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Database Hosting
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              All data is stored in PostgreSQL databases. Database connection
              strings are configured via environment variables. Your database
              provider's privacy policy applies to data storage and backup
              procedures.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Data Retention & Deletion
            </h2>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Active Data Retention
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              User accounts, papers, solutions, and associated data are retained
              indefinitely while your account is active. Sessions expire after 7
              days of inactivity. Verification tokens expire according to their
              expiration timestamps. Rate limit records are reset according to
              their resetAt timestamps.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Cascade Deletion
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              When you delete your account, Prisma cascade rules automatically
              delete all associated data: sessions, OAuth accounts, papers,
              solutions, paper files, paper tags, and user preferences. This
              deletion is permanent and cannot be undone.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Orphaned Data Risk
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              The GenerateFormDraft table intentionally omits a foreign key
              relationship to User. This architectural decision means draft data
              may persist if user accounts are deleted through database
              operations that bypass Prisma's cascade rules. We do not
              automatically clean up orphaned drafts. Additionally, the PaperTag
              table exists for future filtering features but is currently
              unused. Tags may accumulate without active business logic to
              manage them.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Individual Deletion Rights
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You can delete individual papers and solutions through the
              application interface. Deletion is immediate and permanent. File
              metadata associated with deleted papers is also deleted via
              cascade rules. However, if files were previously uploaded to
              Gemini, they are already deleted from Gemini's servers immediately
              after generation completes.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Data Security & Logging
            </h2>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Error Logging
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Our API endpoints use console.error() for error logging. Error
              messages are generic and do not intentionally include personal
              information. However, error objects may contain stack traces or
              context that could inadvertently expose user data if logged to
              external services. We do not currently sanitize error logs before
              output.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Authentication Security
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Session tokens are stored in HTTP-only cookies with a 5-minute
              cache duration. Better Auth handles token generation and
              validation. OAuth tokens are stored in plaintext in our database
              (this is standard practice for OAuth token storage). All API
              endpoints require authentication via session validation.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Rate Limiting
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Rate limiting is enforced at the database level using the
              RateLimit table. Request counts and timestamps are stored to
              prevent abuse. Paper generation endpoints are limited to 2
              requests per minute. All other endpoints are limited to 100
              requests per minute. Rate limit keys may include user identifiers
              or IP addresses.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Your Rights
            </h2>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Access Rights
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You can access all your data through the application interface.
              Papers, solutions, files, and preferences are visible in your
              account. To request a complete data export, contact us at the
              email address provided below.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Correction Rights
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You can update your user preferences (theme, view mode) at any
              time. Paper and solution content can be regenerated or deleted.
              User profile information (name, email, image) is managed through
              Google OAuth and cannot be modified directly in our system.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Deletion Rights
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You can delete individual papers and solutions at any time.
              Account deletion triggers cascade deletion of all associated data.
              Note that orphaned GenerateFormDraft records may persist if
              deletion occurs outside normal application flows.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Portability Rights
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You can export papers and solutions as PDF files through the
              application interface. For machine-readable data exports, contact
              us.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Objection Rights
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You can object to processing of your data by deleting your
              account. Note that Vercel Analytics operates automatically and
              cannot be disabled without modifying the application code.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Legal Basis & Consent
            </h2>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Contractual Necessity
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              We process authentication data, session data, and content data as
              necessary to provide the QuestGen service. Without this data, we
              cannot generate papers, maintain your account, or preserve your
              work.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Legitimate Interests
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              We process IP addresses and user agent strings for security and
              rate limiting. We use Vercel Analytics for service improvement.
              These activities are necessary for service operation and security.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Explicit Consent
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              By signing in with Google OAuth, you consent to sharing your
              Google profile information with QuestGen. By uploading files, you
              consent to temporary processing by Google Gemini API. By using the
              service, you consent to Vercel Analytics collection.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Service Terms
            </h2>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Acceptable Use
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You agree not to use QuestGen to generate content that violates
              copyright, contains illegal material, or infringes on third-party
              rights. You are responsible for ensuring uploaded materials are
              used in compliance with applicable laws and licenses.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Rate Limits
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              Paper generation is limited to 2 papers per minute per user. All
              API endpoints are limited to 100 requests per minute globally.
              Exceeding these limits results in HTTP 429 responses with
              retry-after headers.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Service Availability
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              QuestGen is provided "as is" without warranties. We do not
              guarantee uninterrupted service availability. Generation may fail
              due to third-party API limitations, network issues, or invalid
              input. We are not liable for lost work or data.
            </p>

            <h3 className="mb-4 mt-8 text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Intellectual Property
            </h3>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              You retain ownership of uploaded materials and generated content.
              By using QuestGen, you grant us a license to store and process
              your data as necessary to provide the service. We do not claim
              ownership of your papers or solutions.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Changes to This Policy
            </h2>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              We may update this policy to reflect changes in our data handling
              practices or legal requirements. Material changes will be
              communicated through the application interface or via email. The
              "Last updated" date at the top of this page indicates when changes
              were last made. Continued use of QuestGen after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Contact & Complaints
            </h2>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              For questions about this policy, data access requests, or privacy
              complaints, contact us through the application interface or your
              preferred communication channel. We will respond to requests
              within 30 days as required by applicable privacy laws.
            </p>
            <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              If you are located in the European Economic Area, you have the
              right to lodge a complaint with your local data protection
              authority if you believe we have violated your privacy rights.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
