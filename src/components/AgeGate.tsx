"use client";

import { uiCopy } from "@/lib/content/gameContent";

type AgeGateProps = {
  onConfirm: () => void;
};

export function AgeGate({ onConfirm }: AgeGateProps) {
  return (
    <div className="ageGateScreen">
      <div className="ageGateWrapper">
        <h1 className="ageGateTitle">Flappy Dick</h1>
        <section className="ageGateCard">
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
    </div>
  );
}
