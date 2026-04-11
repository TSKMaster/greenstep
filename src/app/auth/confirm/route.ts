import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PENDING_NAME_COOKIE = "gs_pending_name";
const MAX_FULL_NAME_LENGTH = 80;

function getRequestOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  const protocol = forwardedProto ?? request.nextUrl.protocol.replace(":", "");

  if (host) {
    return `${protocol}://${host}`;
  }

  return request.nextUrl.origin;
}

function normalizeFullName(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, MAX_FULL_NAME_LENGTH);
}

async function syncUserName({
  request,
  supabase,
}: {
  request: NextRequest;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
}) {
  const pendingName = normalizeFullName(request.cookies.get(PENDING_NAME_COOKIE)?.value);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const metadataName = normalizeFullName(
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "",
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const profileName = normalizeFullName(profile?.full_name);
  const finalName = profileName || metadataName || pendingName;

  if (!finalName) {
    return;
  }

  if (!metadataName && pendingName) {
    await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        full_name: pendingName,
      },
    });
  }

  if (!profileName) {
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: finalName,
      },
      {
        onConflict: "id",
      },
    );
  }
}

async function finalizeAuth({
  request,
  redirectTo,
  origin,
  action,
}: {
  request: NextRequest;
  redirectTo: URL;
  origin: string;
  action: (supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) => Promise<{
    error: { message: string } | null;
  }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { error } = await action(supabase);

  if (error) {
    return NextResponse.redirect(new URL("/auth/error", origin));
  }

  try {
    await syncUserName({ request, supabase });
  } catch (syncError) {
    console.error("Failed to sync user name", syncError);
  }

  const response = NextResponse.redirect(redirectTo);
  response.cookies.set(PENDING_NAME_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const origin = getRequestOrigin(request);
  const redirectTo = new URL(next, origin);

  if (code) {
    return finalizeAuth({
      request,
      redirectTo,
      origin,
      action: (supabase) => supabase.auth.exchangeCodeForSession(code),
    });
  }

  if (tokenHash && type) {
    return finalizeAuth({
      request,
      redirectTo,
      origin,
      action: (supabase) =>
        supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "email" | "recovery" | "invite" | "email_change",
        }),
    });
  }

  return NextResponse.redirect(new URL("/auth/error", origin));
}
