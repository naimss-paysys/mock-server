// ─────────────────────────────────────────────
// Shared utilities for mock response generation
// ─────────────────────────────────────────────

/** Random 10-digit transaction reference */
const txRef = () => String(Math.floor(Math.random() * 9000000000) + 1000000000);

/** Random 7-char alphanumeric receipt code */
const txReceipt = () => Math.random().toString(36).slice(2, 9).toUpperCase();

/** Random 12-digit MMO ID */
const mmoId = () => String(Math.floor(Math.random() * 900000000000) + 100000000000);

module.exports = { txRef, txReceipt, mmoId };
