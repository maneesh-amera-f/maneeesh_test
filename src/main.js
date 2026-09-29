import { Intent } from "@frontmltd/frontmjs/core/Intent";
import { D, state } from "@frontmltd/frontmjs/core/State";
import { SYSTEM_INTENTS } from "@frontmltd/frontmjs/core/ALLConstants";

// ─── OPT-IN: exposing MCP tools ──────────────────────────────────────────────
// This app exposes no MCP tools by default, and needs none of the block below
// to run as a normal micro-app. Uncomment ONLY if you are adding MCP tools.
//
// Two things are required, and both are easy to miss:
//   1. Import each tool intent here. Webpack bundles from the import graph, so
//      an intent that is not imported is not bundled — the tool then fails at
//      dispatch with no build error to warn you.
//   2. Set `state.systemId` in `state.onStart`. The reference MCP tool bots set
//      a systemId (and `D.runProfile`); the plain template app does not.
//
// import { Developer } from "@frontmltd/frontmjs/core/Developer";
// import { exampleMcpTool } from "./mcp/example-mcp-tool.js";
//
// state.onStart = async () => {
//   D.runProfile = Developer.DEV();
//   state.systemId = "yourAppAPI";
// };
//
// Then: copy `mcpconfig.example.json` → `mcpconfig.<env>.json`, fill it in, and
// deploy BOTH halves — `npm run deploy:dev` then `npm run deploy:mcp:dev`.
// See README § "Exposing MCP services" and the `/frontm-mcp-tool` skill.
// ─────────────────────────────────────────────────────────────────────────────

export let main = Intent.Create({
  intentId: SYSTEM_INTENTS.MAIN,
  prompt: "This is the main intent for the application",
  state,
});

main.onResolution = async () => {
  "Hello world".sendResponse();
};
