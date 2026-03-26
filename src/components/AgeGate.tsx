"use client";

import { uiCopy } from "@/lib/content/gameContent";

type AgeGateProps = {
  onConfirm: () => void;
};

export function AgeGate({ onConfirm }: AgeGateProps) {
  return (
    <div className="ageGateScreen">
      <section className="ageGateCard">
        <span className="ageGateBadge">18+</span>
        <h1 className="ageGateTitle">{uiCopy.ageGateTitle}</h1>
        <p className="ageGateBody">{uiCopy.ageGateBody}</p>
        <button
          className="gameOverBtn gameOverBtnPrimary ageGateBtn"
          onClick={onConfirm}
          type="button"
        >
          I&apos;m 18+ and ready
        </button>
      </section>
    </div>
  );
}
