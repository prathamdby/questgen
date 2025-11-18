import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

type SessionResponse = Awaited<ReturnType<typeof auth.api.getSession>>;
type NonNullSession = NonNullable<SessionResponse>;
type AuthUser = NonNullSession["user"];

export interface AuthResult {
  success: true;
  userId: string;
  user: AuthUser;
}

export interface AuthError {
  success: false;
  response: NextResponse;
}

export async function withAuth(
  request: NextRequest,
): Promise<AuthResult | AuthError> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as SessionResponse;

  if (!session?.user) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    success: true,
    userId: session.user.id,
    user: session.user,
  };
}

export interface RateLimitResult {
  success: true;
}

export interface RateLimitError {
  success: false;
  response: NextResponse;
}

export async function withRateLimit(
  request: NextRequest,
  userId: string,
  endpoint: string,
): Promise<RateLimitResult | RateLimitError> {
  const rateLimitResult = await checkRateLimit(request, userId, endpoint);

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "X-Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        },
      ),
    };
  }

  return { success: true };
}

export function createErrorResponse(
  error: unknown,
  message: string,
  status: number = 500,
): NextResponse {
  console.error(`${message}:`, error);
  return NextResponse.json(
    {
      error: message,
    },
    { status },
  );
}
