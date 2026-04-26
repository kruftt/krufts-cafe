import { createAuthClient } from "better-auth/react";

export default createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: "http://localhost:5173",
});
