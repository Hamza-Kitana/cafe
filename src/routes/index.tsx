import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { ScrollTrigger, lenisRef } from "@/lib/motion";
import { Loader } from "@/components/chrome/Loader";
import { BallDefs } from "@/components/art/Billiards";
import { Entrance } from "@/sections/Entrance";
import { Inside } from "@/sections/Inside";
import { CoffeeLab } from "@/sections/CoffeeLab";
import { DrinksUniverse } from "@/sections/DrinksUniverse";
import { ShishaLounge } from "@/sections/ShishaLounge";
import { Billiards } from "@/sections/Billiards";
import { CardsTable } from "@/sections/CardsTable";
import { Seating } from "@/sections/Seating";
import { InteractiveTable } from "@/sections/InteractiveTable";
import { FullMenu } from "@/sections/FullMenu";
import { NightMoments } from "@/sections/NightMoments";
import { TheClock } from "@/sections/TheClock";
import { EndOfNight } from "@/sections/EndOfNight";
import { House } from "@/sections/House";
import { Weekly } from "@/sections/Weekly";
import { Reviews } from "@/sections/Reviews";
import { Strip } from "@/components/Strip";
import { ChapterIndicator } from "@/components/chrome/ChapterIndicator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Layali — A Night Inside the Café | Amman" },
      {
        name: "description",
        content:
          "Coffee, mocktails, shisha, billiards and cards. Spend a whole night inside Layali café in Amman.",
      },
      { property: "og:title", content: "Layali — A Night Inside the Café" },
      {
        property: "og:description",
        content: "Coffee. Friends. Games. Nights. A cinematic café experience in Amman.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function SkipLink() {
  const { t } = useI18n();
  return (
    <a href="#menu" className="skip-link">
      {t.skip}
    </a>
  );
}

function Strips({ which }: { which: "night" | "menu" }) {
  const { t } = useI18n();
  return (
    <Strip
      words={t.strips[which]}
      reverse={which === "menu"}
      tone={which === "night" ? "amber" : "cream"}
    />
  );
}

function Index() {
  // The intro only plays on a fresh load of the home page: while hydrating, its server-rendered
  // markup is still in the document; after in-app navigation it never is.
  const [skipIntro] = useState(
    () => typeof document !== "undefined" && !document.querySelector("[data-intro]"),
  );
  const [ready, setReady] = useState(skipIntro);
  const done = useCallback(() => setReady(true), []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!ready || !id) return;
    // Pinned scenes need a refresh before their offsets are reliable.
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY;
      if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <>
      <SkipLink />
      <BallDefs />
      {!skipIntro && <Loader onDone={done} />}
      <ChapterIndicator />
      <main data-i18n-root>
        <Entrance ready={ready} />
        <Inside />
        <CoffeeLab />
        <DrinksUniverse />
        <ShishaLounge />
        <Billiards />
        <CardsTable />
        <Seating />
        <Strips which="night" />
        <House />
        <InteractiveTable />
        <Weekly />
        <Strips which="menu" />
        <FullMenu />
        <Reviews />
        <NightMoments />
        <TheClock />
        <EndOfNight />
      </main>
    </>
  );
}
