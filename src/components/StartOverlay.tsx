"use client";

import { uiCopy } from "@/lib/content/gameContent";

type StartOverlayProps = {
  mode: "title" | "ready";
  onStart?: () => void;
};

export function StartOverlay({
  mode,
  onStart,
}: StartOverlayProps) {
  if (mode === "ready") {
    return (
      <div aria-hidden="true" className="startOverlay startOverlayReady">
        <div className="readyIntro">
          <p className="readyTitle">Get Ready</p>
          <p className="readyPrompt">{uiCopy.startPrompt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="startOverlay startOverlayTitle">
      <div className="titleIntro">
        <div className="titleSkySpacer" />
        <div className="logoBlock">
          <h1 className="retroLogo" aria-label="Flappy Dick">
            <span className="stampBadge">Flappy Dick</span>
          </h1>
        </div>
        <div className="titleActions">
          <button className="introButton" onClick={onStart} type="button">
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
