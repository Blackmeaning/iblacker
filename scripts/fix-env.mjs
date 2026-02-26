// scripts/fix-env.mjs
import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.error("Missing .env file. Create it first (cp .env.example .env).");
  process.exit(1);
}

let env = fs.readFileSync(envPath, "utf8");

// helpers
const getLine = (key) => {
  const re = new RegExp(`^${key}="([^"]*)"\\s*$`, "m");
  const m = env.match(re);
  return m ? m[1] : null;
};

const setLine = (key, value) => {
  const line = `${key}="${value}"`;
  const re = new RegExp(`^${key}="[^"]*"\\s*$`, "m");
  if (re.test(env)) env = env.replace(re, line);
  else env = env.trimEnd() + "\n" + line + "\n";
};

// 1) Fix DATABASE_URL port if missing
const dbUrl = getLine("DATABASE_URL");
if (dbUrl) {
  try {
    const u = new URL(dbUrl);
    if (!u.port) {
      // default postgres port
      u.port = "5432";
      setLine("DATABASE_URL", u.toString());
      console.log("✅ Fixed DATABASE_URL (added :5432).");
    } else {
      console.log("✅ DATABASE_URL already has port:", u.port);
    }
  } catch {
    console.warn("⚠️ DATABASE_URL is not a valid URL string. Please re-check it.");
  }
} else {
  console.warn("⚠️ DATABASE_URL not found in .env");
}

// 2) Auto-set NEXTAUTH_URL based on where you're running
// Priority: explicit NEXTAUTH_URL > Vercel > Codespaces > localhost
const vercelUrl = process.env.VERCEL_URL; // e.g. iblacker-ar2hfnr1g-iblacker.vercel.app
const codespaceName = process.env.CODESPACE_NAME; // e.g. probable-acorn-wr6p94w5vg6j39j99
const currentNextAuthUrl = getLine("NEXTAUTH_URL");

let computed;
if (currentNextAuthUrl) {
  computed = currentNextAuthUrl; // keep what user already set
} else if (vercelUrl) {
  computed = `https://${vercelUrl}`;
} else if (codespaceName) {
  computed = `https://${codespaceName}-3000.app.github.dev`;
} else {
  computed = "http://localhost:3000";
}

setLine("NEXTAUTH_URL", computed);
console.log("✅ Set NEXTAUTH_URL =", computed);

// write back
fs.writeFileSync(envPath, env, "utf8");
console.log("✅ .env updated successfully.");

// Print OAuth redirect URIs you must add to Google Cloud Console
console.log("\nAdd these to Google OAuth Client:");
console.log("Authorized JavaScript origin:");
console.log("  " + new URL(computed).origin);
console.log("Authorized redirect URI:");
console.log("  " + new URL("/api/auth/callback/google", computed).toString());