// Fixed reply for anything the docs do not cover. Its own module so the chat UI can recognise it
// without pulling the server's zod request schemas (messages.ts) into the browser bundle.
export const REFUSAL = "I can only answer questions about the CodeMate AI docs, and I could not find this there. Try asking about installing CodeMate AI, CORA, CORA-CLI, Build or Toolbox.";
