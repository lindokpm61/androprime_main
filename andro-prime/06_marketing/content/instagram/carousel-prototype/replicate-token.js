/*
 * Resolve REPLICATE_API_TOKEN for the carousel scripts.
 *
 * These scripts used to hardcode `d:/Androprime_main/.env`, which only worked on
 * one machine. The repo root is five levels up from this folder
 * (carousel-prototype > instagram > content > 06_marketing > andro-prime > root),
 * so the token is found relative to the checkout instead.
 */

const fs = require('fs');
const path = require('path');

const ENV_PATH = path.resolve(__dirname, '../../../../..', '.env');

module.exports = function replicateToken({ required = true } = {}) {
  if (process.env.REPLICATE_API_TOKEN) return process.env.REPLICATE_API_TOKEN.trim();
  try {
    const m = fs.readFileSync(ENV_PATH, 'utf8').match(/^REPLICATE_API_TOKEN=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  } catch (_) {
    /* fall through to the error below */
  }
  if (!required) return null;
  console.error('REPLICATE_API_TOKEN not found.');
  console.error(`Set it in the environment, or add this line to ${ENV_PATH}:`);
  console.error('  REPLICATE_API_TOKEN=r8_...');
  process.exit(1);
};

module.exports.ENV_PATH = ENV_PATH;
