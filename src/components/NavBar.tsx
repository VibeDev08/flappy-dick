"use client";

import { useEffect, useRef, useState } from "react";

import { socialLinks } from "@/lib/content/gameContent";

type NavBarProps = {
  onOpenLeaderboard: () => void;
};

type ModalType = "about" | "privacy" | null;

function SocialIcon({ id }: { id: string }) {
  if (id === "x") return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  if (id === "instagram") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
  if (id === "discord") return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.086.006.17.017.252a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
  if (id === "reddit") return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );
  return null;
}

export function NavBar({ onOpenLeaderboard }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openModal = (type: ModalType) => {
    setMenuOpen(false);
    setModal(type);
  };

  return (
    <>
      <div className="navMenuWrap" ref={menuRef}>
        <button
          aria-label="Open menu"
          className="navHamburger"
          disabled={modal !== null}
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
        >
          <span className="navHamLine" />
          <span className="navHamLine" />
          <span className="navHamLine" />
        </button>
        {menuOpen && (
          <div className="navDropdown">
            <button
              className="navDropdownItem"
              onClick={() => { setMenuOpen(false); onOpenLeaderboard(); }}
              type="button"
            >
              Leaderboard
            </button>
            <button
              className="navDropdownItem"
              onClick={() => openModal("about")}
              type="button"
            >
              About
            </button>
            <button
              className="navDropdownItem"
              onClick={() => openModal("privacy")}
              type="button"
            >
              Privacy Policy
            </button>
          </div>
        )}
      </div>

      {modal && (
        <div
          className="lbBackdrop"
          role="dialog"
        >
          <div className="lbCard">
            {modal === "about" && (
              <>
                <h2 className="lbTitle">About</h2>
                <div className="navModalBody">
                  <p>
                    <strong>Flappy Dick</strong> — the game nobody asked for but
                    everybody needed. Guide your fearless little guy through an
                    endless gauntlet of throbbing obstacles and try not to choke.
                  </p>
                  <p>
                    Tap. Flap. Die. Repeat.
                  </p>
                  <p>
                    Think you&apos;ve got what it takes to crack the top 10? Spoiler:
                    you probably don&apos;t. But that&apos;s never stopped anyone before.
                  </p>
                  <p>
                    <strong>Controls:</strong> Tap the screen or smash Space to
                    flap. That&apos;s it. We didn&apos;t overcomplicate it.
                  </p>
                  <p style={{color: "rgba(255,255,255,0.4)", fontSize: "0.78rem"}}>
                    18+ only. Not suitable for the easily offended, your boss,
                    or anyone sitting behind you on the bus.
                  </p>
                  <div className="socialLinks">
                    <span className="socialLinksLabel">Follow</span>
                    {socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="socialLinkBtn"
                      >
                        <SocialIcon id={link.id} />
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
            {modal === "privacy" && (
              <>
                <h2 className="lbTitle">Privacy Policy</h2>
                <div className="navModalBody">
                  <p>
                    <strong>We aren&apos;t DICKS:</strong> We don&apos;t take your valuable
                    data and sell it behind your back.
                  </p>
                  <p>
                    <strong>What we collect:</strong> If you submit a leaderboard
                    score, we store the name you provide along with your score.
                    No email, account, or personal data is required.
                  </p>
                  <p>
                    <strong>Cookies &amp; storage:</strong> We use your browser&apos;s
                    local storage to remember your best score and selected
                    character. No tracking cookies are used.
                  </p>
                  <p>
                    <strong>Third parties:</strong> We do not sell or share your
                    data with third parties.
                  </p>
                  <p>
                    <strong>Contact:</strong> Questions? Reach out via the game&apos;s
                    social channels.
                  </p>
                </div>
              </>
            )}
            <button
              className="lbCloseBtn"
              onClick={() => setModal(null)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
