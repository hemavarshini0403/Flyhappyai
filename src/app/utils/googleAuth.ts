export interface GoogleJwtPayload {
  email?: string;
  name?: string;
  picture?: string;
}

export function parseGoogleCredential(credential: string): GoogleJwtPayload | null {
  try {
    const parts = credential.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json) as GoogleJwtPayload;
  } catch {
    return null;
  }
}

export function isGoogleOAuthEnabled(clientId?: string): boolean {
  return Boolean(clientId && clientId !== "your-google-client-id");
}
