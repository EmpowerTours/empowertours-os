// Mera passkey wallet for earvingallardo.com (browser only).
//
// A visitor's wallet is derived from their passkey: Face ID / fingerprint returns the same 32 PRF
// bytes for the same (credential, rpId, salt) forever, and those bytes map through BIP-39 to an
// ordinary secp256k1 account (m/44'/60'/0'/0/0). Same method as Hunt, Turbo and art.empowertours.xyz
// (lib/passkey/derive.ts there), but with THIS site's relying party and salt, so these are new
// wallets, separate from the empowertours.xyz ones. Nothing about the key is sent anywhere: the
// page only signs the server's one-time sign-in message, then zeroes the key.

import { HDKey } from "@scure/bip32";
import { entropyToMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { sha256, stringToBytes } from "viem";

const SALT_LABEL = "earvingallardo/passkey/v1"; // never change: it decides which wallet you get
const CRED_KEY = "eg.wallet.credential";

function rpId() {
  const h = location.hostname;
  return h === "earvingallardo.com" || h.endsWith(".earvingallardo.com")
    ? "earvingallardo.com"
    : h;
}

function keyFromPrf(prfOutput) {
  if (!prfOutput || prfOutput.length !== 32) {
    throw new Error("PRF_UNSUPPORTED");
  }
  const mnemonic = entropyToMnemonic(prfOutput, wordlist);
  const node = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic)).derive(
    "m/44'/60'/0'/0/0",
  );
  if (!node.privateKey) throw new Error("derivation produced no key");
  return node.privateKey;
}

const remember = (id) => {
  try {
    localStorage.setItem(CRED_KEY, id);
  } catch {}
};
const remembered = () => {
  try {
    return localStorage.getItem(CRED_KEY);
  } catch {
    return null;
  }
};

async function derive(create) {
  const mera = await import("@category-labs/mera");
  const salt = sha256(stringToBytes(SALT_LABEL), "bytes");
  if (create) {
    const r = await mera.createPasskeyWithPrfOutput({
      rp: { id: rpId(), name: "Earvin Gallardo" },
      user: {
        name: "earvingallardo.com wallet",
        displayName: "earvingallardo.com wallet",
      },
      prfSalt: salt,
    });
    remember(r.credentialId);
    return keyFromPrf(r.prfOutput);
  }
  const id = remembered();
  const r = await mera.getPasskeyPrfOutput({
    rpId: rpId(),
    prfSalt: salt,
    ...(id ? { credential: { credentialId: id } } : {}),
  });
  remember(r.credentialId);
  return keyFromPrf(r.prfOutput);
}

/**
 * Open (or create) the wallet, sign the server's one-time message, and start a session.
 * Returns { address, name } from the server.
 */
export async function walletSignIn({ create = false } = {}) {
  const { createSecp256k1SigningSession } = await import("@category-labs/mera");
  const { toViemAccount } = await import("@category-labs/mera/viem");
  const key = await derive(create);
  const session = createSecp256k1SigningSession({ privateKey: key });
  key.fill(0);
  try {
    const account = toViemAccount(session);
    const c = await fetch(
      `/api/auth/wallet/challenge?address=${account.address}`,
    );
    const ch = await c.json();
    if (!c.ok) throw new Error(ch.error || "CHALLENGE_FAILED");
    const signature = await account.signMessage({ message: ch.message });
    const v = await fetch("/api/auth/wallet/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: ch.token, signature }),
    });
    const res = await v.json();
    if (!v.ok) throw new Error(res.error || "VERIFY_FAILED");
    return res.wallet;
  } finally {
    session.end();
  }
}

/** Human message for anything a passkey ceremony can throw. */
export function explainWalletError(e) {
  const m = String(e?.message || e);
  const name = e?.name || "";
  if (m === "PRF_UNSUPPORTED")
    return "This browser or password manager can't make a passkey wallet. Try a recent Chrome, Edge or Safari with your device's own passkeys.";
  if (name === "NotAllowedError" || /not allowed|cancel|timed out/i.test(m))
    return "Passkey was cancelled or timed out. Try again, or create a wallet if you don't have one here yet.";
  if (name === "InvalidStateError")
    return "This device already has a wallet for this site. Use Sign in instead.";
  if (/no credentials|not found/i.test(m))
    return "No wallet found on this device for this site. Create one first.";
  if (!m.includes("Error") && m.length < 160) return m;
  return "Wallet sign-in failed. Try again.";
}
