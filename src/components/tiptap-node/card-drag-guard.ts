import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

// Private drag payload types: ProseMirror only pastes text/plain or text/html, so a card dropped
// anywhere outside its own block inserts nothing into the document
export const BENTO_CARD_MIME = "application/x-bento-card";
export const ILLUSTRATION_CARD_MIME = "application/x-illustration-card";

const PRIVATE_CARD_MIMES = [BENTO_CARD_MIME, ILLUSTRATION_CARD_MIME];

function getDragTypes(event: Event): string[] {
  const types = (event as DragEvent).dataTransfer?.types;
  return types ? Array.from(types) : [];
}

export function isPrivateCardDrag(event: Event, mime: string): boolean {
  return getDragTypes(event).includes(mime);
}

function isAnyPrivateCardDrag(event: Event): boolean {
  return getDragTypes(event).some((type) => PRIVATE_CARD_MIMES.includes(type));
}

/**
 * Keeps ProseMirror out of in-block card reordering. Tiptap's default NodeView.stopEvent forwards
 * dragover/drop from inside node views to ProseMirror, which would otherwise insert the drag
 * payload as text and draw its drop cursor over the block.
 *
 * Register this once for all card blocks: extendNodeSchema results are merged last-one-wins, so a
 * second guard would replace the first guard's disableDropCursor.
 */
export const CardDragGuard = Extension.create({
  name: "cardDragGuard",
  priority: 1000,

  // prosemirror-dropcursor listens on the editor DOM directly, so it is suppressed per node spec
  extendNodeSchema() {
    return {
      disableDropCursor: (_view: unknown, _pos: unknown, event: DragEvent) => isAnyPrivateCardDrag(event),
    };
  },

  addProseMirrorPlugins() {
    const claimCardDrag = (_view: unknown, event: Event) => {
      if (!isAnyPrivateCardDrag(event)) return false;
      if (event.type === "drop") event.preventDefault();
      return true;
    };

    return [
      new Plugin({
        key: new PluginKey("cardDragGuard"),
        props: {
          handleDOMEvents: {
            dragenter: claimCardDrag,
            dragover: claimCardDrag,
            drop: claimCardDrag,
          },
        },
      }),
    ];
  },
});
