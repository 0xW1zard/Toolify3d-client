import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return Response.json({ exists: false }, { status: 400 });
    }

    const ctx = await auth.$context;
    const user = await ctx.internalAdapter.findUserByEmail(email);

    return Response.json({ exists: Boolean(user) });
  } catch {
    return Response.json({ exists: false }, { status: 500 });
  }
}
