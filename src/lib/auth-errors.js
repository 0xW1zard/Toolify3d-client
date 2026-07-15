export function isUserAlreadyExistsError(error) {
  if (!error) return false;
  const code = error.code || "";
  const message = (error.message || "").toLowerCase();
  return (
    code === "USER_ALREADY_EXISTS" ||
    code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
    message.includes("already exists")
  );
}

export function isInvalidCredentialsError(error) {
  if (!error) return false;
  const code = error.code || "";
  const message = (error.message || "").toLowerCase();
  return (
    code === "INVALID_EMAIL_OR_PASSWORD" ||
    message.includes("invalid email or password")
  );
}

export async function emailAccountExists(email) {
  try {
    const res = await fetch("/api/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Boolean(data.exists);
  } catch {
    return null;
  }
}
