export const decodeJwtPayload = (token) => {
  try {
    const part = String(token || "").split(".")[1];
    if (!part) return null;

    // base64url -> base64
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
};
