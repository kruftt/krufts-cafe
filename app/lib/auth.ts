import { prisma } from "@lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export default betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),

  emailAndPassword: { enabled: true },
});
