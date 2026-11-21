/**
 * Shared UI helpers, safe escaping, SVG ornaments, and text formatters.
 */

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatShortDate(isoOrDate) {
  if (!isoOrDate) return "";
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return String(isoOrDate);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateTime(isoOrDate) {
  if (!isoOrDate) return "";
  if (typeof isoOrDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(isoOrDate)) {
    return shortDayLabel(isoOrDate);
  }
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return String(isoOrDate);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "2026-12-14" -> "Dec 14" (built from local parts so no timezone shift). */
export function shortDayLabel(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(isoDate || ""));
  if (!m) return String(isoDate || "");
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Today's local date as yyyy-mm-dd, for <input type="date"> and the Sheet. */
export function todayIsoDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Formats a festive plain-text announcement ready to paste into email, text, or Facebook.
 */
export function formatEliminationAnnouncement({
  eventName,
  round,
  label,
  eliminated,
  newlyEliminatedTeams = [],
  remainingPlayers,
  remainingTeams,
  winner = null,
}) {
  const headerLine = label
    ? `${eventName} — Round ${round} (${label})`
    : `${eventName} — Round ${round}`;

  const lines = [
    headerLine,
    "----------------------------------------",
    `Names Eliminated (${eliminated.length}):`,
  ];

  eliminated.forEach((p, idx) => {
    lines.push(`${idx + 1}. ${p.name} — ${p.team}`);
  });

  if (newlyEliminatedTeams.length > 0) {
    lines.push("");
    lines.push(
      newlyEliminatedTeams.length === 1
        ? `Team Eliminated: ${newlyEliminatedTeams[0]}`
        : `Teams Eliminated: ${newlyEliminatedTeams.join(", ")}`
    );
  }

  lines.push("");
  if (winner) {
    lines.push(`WE HAVE A WINNER! Congratulations to ${winner.name} (${winner.team})!`);
  } else if (typeof remainingPlayers === "number") {
    lines.push(
      `Still Standing: ${remainingPlayers} ${remainingPlayers === 1 ? "player" : "players"} across ${remainingTeams} ${remainingTeams === 1 ? "team" : "teams"}.`
    );
  }

  return lines.join("\n");
}

/**
 * Inline tasteful SVG icons
 */
export const ICONS = {
  wineHolly: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M11 4h10l-0.7 7.6c-0.3 3.1-2.2 5.4-4.3 5.4s-4-2.3-4.3-5.4L11 4Z" stroke="currentColor" stroke-width="1.6" fill="rgba(233,201,136,0.16)"/>
    <path d="M11.6 10.5c2.2 1.2 6.6 1.2 8.8 0" stroke="currentColor" stroke-width="1.4"/>
    <path d="M16 17v9.5M11.5 26.5h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="7" cy="22" r="1.5" fill="#d97b87"/>
    <circle cx="25" cy="22" r="1.5" fill="#d97b87"/>
    <path d="M4.5 19.5c1.8-0.6 3.5 0.2 4.3 1.7-1.7 0.7-3.6 0-4.3-1.7Z" fill="#7aa991"/>
    <path d="M27.5 19.5c-1.8-0.6-3.5 0.2-4.3 1.7 1.7 0.7 3.6 0 4.3-1.7Z" fill="#7aa991"/>
  </svg>`,

  search: `<svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7.5"/>
    <path d="m20 20-3.8-3.8"/>
  </svg>`,

  print: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 9V2h12v7"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>`,

  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`,

  undo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 7v6h6"/>
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
  </svg>`,

  crown: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 18h18v2H3v-2Zm0-2 2-9 5 4 2-6 2 6 5-4 2 9H3Z"/>
  </svg>`,

  history: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 2"/>
  </svg>`,

  refresh: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-2.64-6.36"/>
    <path d="M21 3v6h-6"/>
  </svg>`,
};

/** Keep ?roster=37 on internal page links so navigating stays in the 37x7 demo. */
export function preserveRosterParam() {
  const roster = new URLSearchParams(window.location.search).get("roster");
  if (!roster) return;
  document.querySelectorAll("a[href$='.html']").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    a.setAttribute("href", `${href}?roster=${encodeURIComponent(roster)}`);
  });
}
