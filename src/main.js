import { Intent } from "@frontmltd/frontmjs/core/Intent";
import { D, state } from "@frontmltd/frontmjs/core/State";
import { SYSTEM_INTENTS } from "@frontmltd/frontmjs/core/ALLConstants";

export const main = Intent.Create({
  intentId: SYSTEM_INTENTS.MAIN,
  prompt: "This is the main intent for the Hello World application",
  state,
});

main.onResolution = () => {
  D.log({
    message: "Hello World intent triggered",
    data: { intentId: SYSTEM_INTENTS.MAIN },
  });

  "Hello World! Welcome to frontM".sendResponse();
};
