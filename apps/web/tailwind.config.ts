import shared from "../../packages/config/tailwind/tailwind.config";
export default {
  ...shared,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ]
};
