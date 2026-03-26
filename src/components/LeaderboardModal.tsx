"use client";

import type { LeaderboardEntry } from "@/lib/leaderboard/shared";

const ORDINALS = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH"];
const MEDALS = ["🥇", "🥈", "🥉"];

type LeaderboardModalProps = {
  entries: LeaderboardEntry[];
  open: boolean;
  onClose: () => void;
};

export function LeaderboardModal({ entries, open, onClose }: LeaderboardModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="lbBackdrop" onClick={onClose} role="presentation">
      <div className="lbCard" onClick={(event) => event.stopPropagation()} role="dialog">
        <h2 className="lbTitle">Top 10 Leaderboard</h2>

        <div className="lbTable">
          <div className="lbHeaderRow">
            <span>Rank</span>
            <span>Name</span>
            <span>Score</span>
          </div>

          {entries.length === 0 ? (
            <div className="lbEmpty">No scores yet. Be the first.</div>
          ) : (
            entries.map((entry, i) => (
              <div className="lbRow" key={entry.id}>
                <span className="lbRank">
                  {MEDALS[i] ? <span className="lbMedal">{MEDALS[i]}</span> : null}
                  {ORDINALS[i] ?? `${i + 1}TH`}
                </span>
                <span className="lbName">{entry.name}</span>
                <span className="lbScore">{entry.score}</span>
              </div>
            ))
          )}
        </div>

        <button className="lbCloseBtn" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  );
}
