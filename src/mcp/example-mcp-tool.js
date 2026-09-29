/**
 * EXAMPLE MCP TOOL INTENT — TEMPLATE TO COPY, NOT LIVE CODE.
 *
 * This file is deliberately NOT imported by `src/main.js`, so webpack does not
 * bundle it and this app exposes no MCP tools by default. Exposing MCP is opt-in.
 *
 * To turn this into a real tool:
 *   1. Copy this file to `src/mcp/<your-tool>.js` and rename the intent.
 *   2. Uncomment the MCP bootstrap block in `src/main.js` and import your intent
 *      there — an intent that is never imported is never bundled, and the tool
 *      will fail at dispatch with no build error to warn you.
 *   3. Copy `mcpconfig.example.json` to `mcpconfig.<env>.json` and fill it in.
 *      `intentId` there MUST equal INTENT_NAME below; `botId` there MUST equal
 *      the `botId` in `deployment.config.<env>.json`.
 *   4. `npm run deploy:dev` then `npm run deploy:mcp:dev` — BOTH, in that order.
 *      The first ships the bot; the second registers the tool. Neither alone works.
 *
 * See README § "Exposing MCP services" and the `/frontm-mcp-tool` skill.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BUILD TARGET — decided, but worth confirming once.
 *
 * This template targets **Node 22** (`webpack.config.js`), by decision: frontm.ai
 * is standardising all Lambdas on Node 22, and there is ONE runtime Lambda that
 * executes all micro-app code, so the runtime's Node version governs what every
 * micro-app build targets. The reference tool bots in `frontmltd/mcp-server` still
 * build `target: ["node", "es5"]` with `arrowFunction: false` — that is **legacy,
 * not the standard to match**. Do not downgrade this template to es5.
 *
 * Still worth confirming with the mcp-server owner: if MCP dispatch turns out to
 * require the es5 build, that is a constraint to fix IN mcp-server, not a reason
 * to hold this template back. The failure mode is the reason to check at all — it
 * would surface at dispatch, not at build: the build passes and `tools/call` fails.
 * See README § "Open questions".
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Intent } from "@frontmltd/frontmjs/core/Intent";
import { D, state } from "@frontmltd/frontmjs/core/State";

// NOTE — constructor form. This uses `new Intent(NAME, state)`, which is what the
// reference MCP tool bots in `frontmltd/mcp-server` use, NOT the `Intent.Create({...})`
// form used elsewhere in this template and documented in CLAUDE.md. Both exist in the
// framework; the MCP reference implementation is followed here deliberately, since the
// dispatch path is what this code has to satisfy. If you prefer `Intent.Create`, verify
// against a working MCP tool first — do not assume the two are interchangeable here.

// Must match `intentId` in mcpconfig.<env>.json, exactly.
const INTENT_NAME = "exampleMcpTool";

export const exampleMcpTool = new Intent(INTENT_NAME, state);

// MCP tools always execute server-side. Never omit this.
exampleMcpTool.runOnCloud();

// Gate strictly on intentId so several tools can share one bot without cross-routing.
exampleMcpTool.onMatching = () =>
  state.messageFromUser.intentId === INTENT_NAME;

/** Arguments arrive as a JSON string in the message body. */
const parsePayload = () =>
  JSON.parse(state._.get(state, "messageFromUser.body"));

/** Success — the MCP server renders this as `content`. */
const sendSuccess = (toolResult) =>
  state.api.sendResponse({ response: { toolResult } });

/** Failure — the MCP server renders this as `isError` + `content`. */
const sendError = (message) =>
  state.api.sendResponse({
    response: { toolError: { type: "text", text: message } },
  });

exampleMcpTool.onResolution = async () => {
  D.log({ message: `${INTENT_NAME}: start`, data: state.messageFromUser });
  try {
    const payload = parsePayload();

    // The MCP server already validates `required` and declared types from
    // inputSchema. Re-check anyway — belt and braces.
    const errorMessage = state.frontmlib.validateRequiredFields(payload, [
      "exampleInput",
    ]);
    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const result = await doTheWork(payload);

    // `toolResult` may be a single object or an array; both are normalised to
    // an array by the MCP server. `type` is "text" for textual results.
    sendSuccess({
      type: "text",
      text: `Example tool completed: ${result.summary}`,
    });
  } catch (error) {
    // Anything thrown above becomes an MCP error result, not a crash.
    sendError(error.message);
  }
};

/** Replace with the real work — a capability call, a collection read, an API call. */
async function doTheWork({ exampleInput }) {
  return await Promise.resolve({ summary: `received "${exampleInput}"` });
}
