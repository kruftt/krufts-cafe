import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [reactRouter(), tailwindcss()],
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "app/components"),
			"@lib": path.resolve(__dirname, "app/lib"),
			"@routes": path.resolve(__dirname, "app/routes"),
			"@services": path.resolve(__dirname, "app/services"),
			"@state": path.resolve(__dirname, "app/state"),
		},
	},
});
