import type { Config } from "tailwindcss";

export default {
  content: [
    "../../apps/web/app/**/*.{ts,tsx}",
    "../../apps/web/components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
