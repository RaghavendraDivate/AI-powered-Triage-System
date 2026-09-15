import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Suppress browser extension warnings while preserving API debugging logs
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = function (...args) {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("Video element not found") ||
      message.includes("message channel closed") ||
      message.includes("Form submission canceled")) &&
    !message.includes("🔍") && // Preserve API debugging logs with emojis
    !message.includes("API") && // Preserve API-related logs
    !message.includes("🌐") &&
    !message.includes("📤") &&
    !message.includes("📥")
  ) {
    return; // Suppress these extension-related warnings only
  }
  originalConsoleWarn.apply(console, args);
};

console.error = function (...args) {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("Video element not found") ||
      message.includes("message channel closed") ||
      message.includes("Form submission canceled")) &&
    !message.includes("❌") && // Preserve API error logs
    !message.includes("API") && // Preserve API-related logs
    !message.includes("🚨")
  ) {
    return; // Suppress these extension-related errors only
  }
  originalConsoleError.apply(console, args);
};

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
