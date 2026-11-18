import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

// "Cmd" on Apple devices, "Ctrl" elsewhere (server render and first paint say Ctrl)
export function useModKey() {
  return useSyncExternalStore(subscribe, isMac, () => false) ? "Cmd" : "Ctrl";
}
