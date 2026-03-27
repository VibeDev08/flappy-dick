"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AgeGate } from "@/components/AgeGate";
import { CharacterSelect } from "@/components/CharacterSelect";
import { GameCanvas } from "@/components/GameCanvas";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { NavBar } from "@/components/NavBar";
import { ResultOverlay } from "@/components/ResultOverlay";
import { StartOverlay } from "@/components/StartOverlay";
import { AudioDirector } from "@/lib/audio/audioDirector";
import { avatars, type AvatarId } from "@/lib/content/gameContent";
import type { GameState } from "@/lib/game-core/types";
import { isTopTen, type LeaderboardEntry } from "@/lib/leaderboard/shared";
import {
  loadBoolean,
  loadCharacter,
  loadNumber,
  saveBoolean,
  saveCharacter,
  saveNumber,
  storageKeys,
} from "@/lib/persistence/browserStorage";

type RunTokenResponse = {
  token: string;
};

type ResultState = {
  score: number;
  qualifies: boolean;
};

type IntroStage = "title" | "choose" | "ready" | "playing";

const defaultCharacter: AvatarId = avatars[0].id;

export function GameShell() {
  const audioRef = useRef(new AudioDirector());
  const [hydrated, setHydrated] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<AvatarId>(defaultCharacter);
  const [pendingCharacter, setPendingCharacter] = useState<AvatarId | null>(null);
  const [muted, setMuted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [restartSeed, setRestartSeed] = useState(0);
  const [runToken, setRunToken] = useState<string | null>(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const [introStage, setIntroStage] = useState<IntroStage>("title");
  const [result, setResult] = useState<ResultState | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const confirmed = loadBoolean(storageKeys.ageConfirmed);
    const storedCharacter = loadCharacter(defaultCharacter);
    const storedBestScore = loadNumber(storageKeys.bestScore);
    const storedMuted = loadBoolean(storageKeys.muted);
    setAgeConfirmed(confirmed);
    setSelectedCharacter(storedCharacter);
    setBestScore(storedBestScore);
    setMuted(storedMuted);
    audioRef.current.setMuted(storedMuted);
  }, []);

  const refreshLeaderboard = useCallback(async () => {
    const response = await fetch("/api/leaderboard");
    const payload = (await response.json()) as { entries: LeaderboardEntry[] };
    setLeaderboardEntries(payload.entries);
  }, []);

  useEffect(() => {
    void refreshLeaderboard();
  }, [refreshLeaderboard]);

  const beginRun = useCallback(async () => {
    setLoadingRun(true);
    setResult(null);
    setSubmitError(null);
    audioRef.current.stopLoop();
    // Pre-warm the AudioContext while the network round-trip is in flight so the
    // OS audio subsystem is ready before the first flap (avoids a ~100–300ms stutter).
    void audioRef.current.ensureReady();
    const response = await fetch("/api/run-token", { method: "POST" });
    const payload = (await response.json()) as RunTokenResponse;
    setRunToken(payload.token);
    setRestartSeed((value) => value + 1);
    setLoadingRun(false);
    setIntroStage("ready");
  }, []);

  useEffect(() => {
    audioRef.current.setMuted(muted);
    saveBoolean(storageKeys.muted, muted);
  }, [muted]);

  const retryRun = useCallback(async () => {
    setRunToken(null);
    await beginRun();
  }, [beginRun]);

  const handleRunStart = useCallback(async () => {
    setIntroStage("playing");
    await audioRef.current.startLoop();
  }, []);

  useEffect(() => {
    if (!result) {
      return;
    }

    const handleRetryShortcut = (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        return;
      }
      event.preventDefault();
      void retryRun();
    };

    window.addEventListener("keydown", handleRetryShortcut);
    return () => window.removeEventListener("keydown", handleRetryShortcut);
  }, [result, retryRun]);

  useEffect(() => {
    if (introStage !== "title") {
      return;
    }

    const handleTitleShortcut = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setPendingCharacter(null);
        setIntroStage("choose");
      }
    };

    window.addEventListener("keydown", handleTitleShortcut);
    return () => window.removeEventListener("keydown", handleTitleShortcut);
  }, [introStage]);

  const onCrash = useCallback(
    async (state: GameState) => {
      audioRef.current.stopLoop();
      await audioRef.current.playCrash();
      const nextBest = Math.max(bestScore, state.score);
      setBestScore(nextBest);
      saveNumber(storageKeys.bestScore, nextBest);

      const response = await fetch("/api/leaderboard");
      const payload = (await response.json()) as { entries: LeaderboardEntry[] };
      const freshEntries = payload.entries;
      setLeaderboardEntries(freshEntries);

      setResult({
        score: state.score,
        qualifies: isTopTen(freshEntries, state.score),
      });
    },
    [bestScore],
  );

  const shareScore = useCallback(() => {
    if (!result) {
      return;
    }

    const text = `I scored ${result.score} on Flappy Dick 🍆💦 Can you beat me?`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [result]);

  const submitName = useCallback(
    async (name: string) => {
      if (!result || !runToken) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      const response = await fetch("/api/leaderboard/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          score: result.score,
          characterId: selectedCharacter,
          token: runToken,
        }),
      });
      const payload = (await response.json()) as { entries?: LeaderboardEntry[]; error?: string };
      setIsSubmitting(false);

      if (!response.ok || !payload.entries) {
        setSubmitError(payload.error ?? "Could not save score.");
        return;
      }

      setLeaderboardEntries(payload.entries);
      setLeaderboardOpen(true);
    },
    [result, runToken, selectedCharacter],
  );

  const showTitleOverlay = introStage === "title" && !result;
  const showChooseOverlay = introStage === "choose" && !result;
  const showReadyOverlay = introStage === "ready" && !result;

  if (!hydrated) {
    return <section className="panel">Loading the airspace...</section>;
  }

  if (!ageConfirmed) {
    return (
      <AgeGate
        onConfirm={() => {
          setAgeConfirmed(true);
          saveBoolean(storageKeys.ageConfirmed, true);
        }}
      />
    );
  }

  return (
    <>
      <section className="gameFrame">
        <NavBar onOpenLeaderboard={() => setLeaderboardOpen(true)} />
        <div className="canvasShell">
          {loadingRun ? <div className="canvasLoading">Spinning up a fresh run...</div> : null}
          <GameCanvas
            acceptInput={introStage !== "title" && !result}
            characterId={selectedCharacter}
            hidePlayer={showChooseOverlay}
            onCrash={(state) => void onCrash(state)}
            onFlap={() => void audioRef.current.playFlap()}
            onRunStart={() => void handleRunStart()}
            onScore={() => void audioRef.current.playScore()}
            restartSeed={restartSeed}
          />
          {showTitleOverlay ? (
            <StartOverlay mode="title" onStart={() => { setPendingCharacter(null); setIntroStage("choose"); }} />
          ) : null}
          {showChooseOverlay ? (
            <CharacterSelect
              onContinue={() => {
                const chosen = pendingCharacter ?? "ivory-twin";
                setSelectedCharacter(chosen);
                saveCharacter(chosen);
                void beginRun();
              }}
              onSelect={setPendingCharacter}
              selected={pendingCharacter}
            />
          ) : null}
          {showReadyOverlay ? <StartOverlay mode="ready" /> : null}
          {result ? (
            <ResultOverlay
              bestScore={bestScore}
              isSubmitting={isSubmitting}
              onRetry={() => void retryRun()}
              onShare={() => void shareScore()}
              onSubmitName={(name) => void submitName(name)}
              qualifies={result.qualifies}
              score={result.score}
              submitError={submitError}
            />
          ) : null}
        </div>
      </section>

      <LeaderboardModal entries={leaderboardEntries} onClose={() => setLeaderboardOpen(false)} open={leaderboardOpen} />
    </>
  );
}
