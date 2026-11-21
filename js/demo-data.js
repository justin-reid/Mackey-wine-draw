/**
 * Built-in Demo Dataset for The Mackey Christmas Wine Draw.
 * Mirrors the Sheet layout: ticket, name, team, eliminated date ("" = still in).
 * 8 teams, 32 players, two past draw days (two days ago and yesterday),
 * including one fully eliminated team.
 */

function pad(n) {
  return String(n).padStart(2, "0");
}

function localIsoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function createInitialDemoPlayers() {
  const dateForDay = { 1: localIsoDaysAgo(2), 2: localIsoDaysAgo(1) };

  const rows = [
    // Bordeaux Bells: all 4 in
    { team: "Bordeaux Bells", name: "Margaret Mackey" },
    { team: "Bordeaux Bells", name: "Arthur Pendelton" },
    { team: "Bordeaux Bells", name: "Evelyn Brooks" },
    { team: "Bordeaux Bells", name: "Graham Whitaker" },

    // The Cabernet Carolers: 3 in, 1 out
    { team: "The Cabernet Carolers", name: "Patricia Holloway" },
    { team: "The Cabernet Carolers", name: "Richard Caldwell", out: 1 },
    { team: "The Cabernet Carolers", name: "Barbara Sinclair" },
    { team: "The Cabernet Carolers", name: "Thomas Lindholm" },

    // Mistletoe Merlots: 2 in, 2 out
    { team: "Mistletoe Merlots", name: "Susan Gallagher", out: 1 },
    { team: "Mistletoe Merlots", name: "Robert Thornton" },
    { team: "Mistletoe Merlots", name: "Carol Hendricks", out: 2 },
    { team: "Mistletoe Merlots", name: "Kenneth Marlow" },

    // Fireside Pinot: 3 in, 1 out
    { team: "Fireside Pinot", name: "Diane Mercer" },
    { team: "Fireside Pinot", name: "William Halstead" },
    { team: "Fireside Pinot", name: "Nancy Pritchard" },
    { team: "Fireside Pinot", name: "Edward Kowalski", out: 2 },

    // Snowfall Sauvignon: 2 in, 2 out
    { team: "Snowfall Sauvignon", name: "Helen MacAllister", out: 1 },
    { team: "Snowfall Sauvignon", name: "Charles Beaumont" },
    { team: "Snowfall Sauvignon", name: "Dorothy Callahan" },
    { team: "Snowfall Sauvignon", name: "George Ellison", out: 2 },

    // Holly & Shiraz: 1 in, 3 out
    { team: "Holly & Shiraz", name: "Linda Fitzpatrick", out: 1 },
    { team: "Holly & Shiraz", name: "Donald McAllister", out: 1 },
    { team: "Holly & Shiraz", name: "Sharon Alvarez" },
    { team: "Holly & Shiraz", name: "Paul Donovan", out: 2 },

    // Champagne Sleigh: 3 in, 1 out
    { team: "Champagne Sleigh", name: "Karen O'Sullivan" },
    { team: "Champagne Sleigh", name: "David Reynolds" },
    { team: "Champagne Sleigh", name: "Betty Zimmerman", out: 2 },
    { team: "Champagne Sleigh", name: "Frank Pellegrini" },

    // Cellar Noel: fully eliminated
    { team: "Cellar Noel", name: "Judith Armstrong", out: 1 },
    { team: "Cellar Noel", name: "Raymond Foster", out: 1 },
    { team: "Cellar Noel", name: "Sandra Delgado", out: 2 },
    { team: "Cellar Noel", name: "Walter Bennett", out: 2 },
  ];

  return rows.map((row, idx) => ({
    id: idx + 1,
    ticket: idx + 1,
    team: row.team,
    name: row.name,
    eliminatedDate: row.out ? dateForDay[row.out] : "",
  }));
}
