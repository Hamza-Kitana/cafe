import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

export function useSound() {
  const [enabled, setEnabled] = useState(sound.enabled);
  useEffect(() => sound.subscribe(setEnabled), []);
  return { enabled, toggle: () => sound.toggle() };
}
