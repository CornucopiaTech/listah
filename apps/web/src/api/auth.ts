


export const GenericError = "An unexpected error occurred. Please try again later";
export const GenericCode = "NETWORK_DISCONNECTED";



export async function getToken() {
  let token = "";
  if (typeof window !== 'undefined' && (window as any).Clerk?.session) {
    try {
      // Fetch a fresh token directly from the vanilla instance
      token = await (window as any).Clerk.session.getToken({ template: "api-jwt" });

      if (token) {
        token = `Bearer ${token}`;
        return token;
      }
    } catch (error) {
      console.error("Failed to fetch Clerk token outside component:", error);
    }
  }
}
