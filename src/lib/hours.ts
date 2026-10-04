import { useEffect, useState } from "react";

/** Opening hours in minutes after midnight, Amman time. Closing past midnight wraps. */
export const OPEN_AT = 16 * 60;
export const CLOSE_AT = 2 * 60;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type AmmanTime = { day: number; minutes: number };

function ammanNow(): AmmanTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Amman",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    day: WEEKDAYS.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export const isOpen = ({ minutes }: AmmanTime) => minutes >= OPEN_AT || minutes < CLOSE_AT;

/** After midnight the night still belongs to the previous calendar day. */
export const nightOf = ({ day, minutes }: AmmanTime) => (minutes < CLOSE_AT ? (day + 6) % 7 : day);

/** Current Amman time, refreshed every minute. Null until mounted so SSR markup stays stable. */
export function useAmmanTime() {
  const [now, setNow] = useState<AmmanTime | null>(null);
  useEffect(() => {
    const update = () => setNow(ammanNow());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
