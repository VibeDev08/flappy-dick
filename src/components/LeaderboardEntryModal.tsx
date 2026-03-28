"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

type LeaderboardEntryModalProps = {
  open: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmitName: (name: string) => void;
};

export function LeaderboardEntryModal({
  open,
  isSubmitting,
  submitError,
  onSubmitName,
}: LeaderboardEntryModalProps) {
  const [name, setName] = useState("");
  const isDisabled = isSubmitting || name.trim().length === 0;

  useEffect(() => {
    if (!open) return;

    const fire = (particleRatio: number, opts: confetti.Options) => {
      void confetti({
        origin: { y: 0.55 },
        disableForReducedMotion: true,
        zIndex: 4001,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#e85d04", "#ff9c44"] });
    fire(0.2,  { spread: 60, colors: ["#ffffff", "#f5e6c8"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#e85d04", "#ff6e14", "#ffffff"] });
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#ffd700", "#ffffff"] });
    fire(0.1,  { spread: 120, startVelocity: 45, colors: ["#e85d04", "#ff9c44"] });
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="lbBackdrop leBackdrop" role="presentation">
      <div className="lbCard leCard" onClick={(event) => event.stopPropagation()} role="dialog">
        <div className="lbHeader">
          <h2 className="lbTitle leTitle">Congratulations!</h2>
          <p className="lbSubtitle leSubtitle">
            You went balls deep and made it to the top 10.
          </p>
        </div>

        <form
          className="leForm"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitName(name);
          }}
        >
          <input
            autoFocus
            className="leInput"
            id="leaderboard-name"
            maxLength={10}
            onChange={(event) => setName(event.target.value)}
            placeholder="NAME"
            required
            value={name}
          />
          {submitError && <p className="errorText">{submitError}</p>}
          <button className="leSubmitBtn" disabled={isDisabled} type="submit">
            {isSubmitting ? "Saving..." : "Claim My Spot"}
          </button>
        </form>

      </div>
    </div>
  );
}
