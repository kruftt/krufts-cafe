import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: "http://192.168.0.106:5173",
	// baseURL: "http://localhost:5173",
});

export default auth;
