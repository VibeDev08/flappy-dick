"use client";

import { avatars, type AvatarId } from "@/lib/content/gameContent";

type CharacterSelectProps = {
  selected: AvatarId | null;
  onSelect: (value: AvatarId) => void;
  onContinue: () => void;
};

export function CharacterSelect({ selected, onSelect, onContinue }: CharacterSelectProps) {
  return (
    <div className="chooseOverlay">
      <div className="chooseBanner">
        <span className="chooseTitle">Pick Your Dick</span>
      </div>

      <div className="chooseGrid">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            className={`chooseCard ${selected === avatar.id ? "chooseCardSelected" : ""}`}
            onClick={() => onSelect(avatar.id)}
            type="button"
          >
            <div className="choosePenisPreview">
              <div className="choosePenisShaft" style={{ background: avatar.shaftColor, height: `${Math.min(Math.round(72 * avatar.lengthScale), 107)}px` }}>
                <div className="choosePenisHead" style={{ background: avatar.headColor }} />
              </div>
            </div>
            <span className="chooseCardLabel">{avatar.label}</span>
          </button>
        ))}
      </div>

      <button className="gameOverBtn gameOverBtnPrimary chooseConfirmBtn" disabled={!selected} onClick={onContinue} type="button">
        Let's Go
      </button>
    </div>
  );
}
