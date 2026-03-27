"use client";

import { useState } from "react";

import { gooLines } from "@/lib/content/gameContent";

type ResultOverlayProps = {
  score: number;
  bestScore: number;
  qualifies: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onRetry: () => void;
  onSubmitName: (name: string) => void;
  onShare: () => void;
};

export function ResultOverlay({
  score,
  bestScore,
  qualifies,
  isSubmitting,
  submitError,
  onRetry,
  onSubmitName,
  onShare,
}: ResultOverlayProps) {
  const [name, setName] = useState("");
  const [quip] = useState(() => gooLines[Math.floor(Math.random() * gooLines.length)]);
  const isDisabled = isSubmitting || name.trim().length === 0;

  return (
    <div className="gameOverScreen">
      <div className="gameOverBanner">
        <span className="gameOverText">Game Over</span>
      </div>

      <div className="splatContainer">
        <svg className="splatSvg" viewBox="0 0 400 340" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="splat-round" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur"/>
              <feColorMatrix in="blur" type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"/>
            </filter>
          </defs>
          <g filter="url(#splat-round)">
            <ellipse fill="white" cx="195" cy="168" rx="88" ry="78"/>
            {/* top-left protrusion — large */}
            <circle fill="white" cx="148" cy="68"  r="42"/>
            {/* top-right protrusion — medium */}
            <circle fill="white" cx="262" cy="82"  r="32"/>
            {/* far right — long thin one */}
            <circle fill="white" cx="312" cy="148" r="24"/>
            {/* lower-right — medium */}
            <circle fill="white" cx="278" cy="238" r="35"/>
            {/* bottom — small */}
            <circle fill="white" cx="188" cy="268" r="26"/>
            {/* bottom-left — large */}
            <circle fill="white" cx="108" cy="252" r="38"/>
            {/* left — medium */}
            <circle fill="white" cx="68"  cy="172" r="30"/>
            {/* upper-left — small */}
            <circle fill="white" cx="98"  cy="88"  r="24"/>
          </g>
          <circle fill="white" cx="345" cy="105" r="10"/>
          <circle fill="white" cx="52"  cy="62"  r="7"/>
          <circle fill="white" cx="230" cy="310" r="9"/>
          <circle fill="white" cx="34"  cy="240" r="6"/>
          <ellipse fill="white" cx="360" cy="210" rx="14" ry="8" transform="rotate(-30 360 210)"/>
        </svg>
        <div className="splatContent">
          <div className="scorePanelRow">
            <div className="scorePanelCol">
              <span className="scorePanelLabel">Score</span>
              <span className="scorePanelValue">{score}</span>
            </div>
            <div className="scorePanelDivider" />
            <div className="scorePanelCol">
              <span className="scorePanelLabel">Best</span>
              <span className="scorePanelValue">
                {bestScore}
              </span>
            </div>
          </div>
          <p className="gameOverQuip">{quip}</p>
        </div>
      </div>

      {qualifies && (
        <form
          className="gameOverNameForm"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitName(name);
          }}
        >
          <p className="gameOverNamePrompt">You made the top 10! Enter your name:</p>
          <div className="gameOverNameRow">
            <input
              className="gameOverNameInput"
              id="leaderboard-name"
              maxLength={8}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              value={name}
            />
            <button
              className="gameOverBtn gameOverSaveBtn"
              disabled={isDisabled}
              type="submit"
            >
              {isSubmitting ? "..." : "Save"}
            </button>
          </div>
          {submitError && <p className="errorText">{submitError}</p>}
        </form>
      )}

      <div className="gameOverActions">
        <button className="gameOverBtn" onClick={onShare} type="button">
          Share
        </button>
        <button className="gameOverBtn gameOverBtnPrimary" onClick={onRetry} type="button">
          Retry
        </button>
      </div>
    </div>
  );
}
