"use client";

import { AvatarIcon } from "@/components/AvatarIcon";
import type { AvatarId } from "@/lib/content/gameContent";
import type { LeaderboardEntry } from "@/lib/leaderboard/shared";

const ORDINALS = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH"];
const MEDALS = ["🥇", "🥈", "🥉"];
const ROW_HIGHLIGHT_CLASS = ["lbRowGold", "lbRowSilver", "lbRowBronze"];
const LEADERBOARD_ICON_ID: AvatarId = "ivory-twin";
const FIRST_PLACE_PALETTE_ID: AvatarId = "onyx-twin";
const FIRST_PLACE_SHAFT_EXTENSION_X = 18;

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
        <div className="lbHeader">
          <h2 className="lbTitle">Leaderboard</h2>
          <p className="lbSubtitle">The best last longer than the rest.</p>
        </div>

        <div className="lbTable">
          <div className="lbHeaderRow">
            <span>Rank</span>
            <div className="lbRowBody">
              <span>Name</span>
              <span>Penis</span>
              <span className="lbScore">Score</span>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="lbEmpty">No scores yet. Be the first.</div>
          ) : (
            entries.map((entry, i) => (
              <div className={["lbRow", ROW_HIGHLIGHT_CLASS[i] ?? ""].join(" ").trim()} key={entry.id}>
                <span className="lbRank">
                  {ORDINALS[i] ?? `${i + 1}TH`}
                  {MEDALS[i] ? <span className="lbMedal">{MEDALS[i]}</span> : null}
                </span>
                <div className="lbRowBody">
                  <span className="lbName">{entry.name}</span>
                  <span className="lbAvatar">
                    <AvatarIcon
                      characterId={LEADERBOARD_ICON_ID}
                      paletteCharacterId={entry.characterId === "onyx-twin" ? FIRST_PLACE_PALETTE_ID : LEADERBOARD_ICON_ID}
                      strokeColor={entry.characterId === "onyx-twin" ? "#6b3a2e" : undefined}
                      shaftExtensionX={entry.characterId === "onyx-twin" ? FIRST_PLACE_SHAFT_EXTENSION_X : 0}
                    />
                  </span>
                  <span className="lbScore">{entry.score}</span>
                </div>
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
