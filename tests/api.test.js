/**
 * Unit tests for js/api.js (board builder & demo-mode draw/undo/passcode).
 *   node tests/api.test.js
 */
const assert = require("assert");

// Minimal browser globals for js/api.js
const store = new Map();
global.window = { WINE_DRAW_CONFIG: { API_URL: "", demoPasscode: "mackey" } };
global.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

(async () => {
  const api = await import("../js/api.js");
  let passed = 0;

  async function test(name, fn) {
    store.clear();
    await fn();
    passed++;
    console.log("  ok  " + name);
  }

  console.log("Frontend API tests (js/api.js)");

  await test("buildBoardFromPlayers groups teams in sheet order and computes rounds by date", () => {
    const board = api.buildBoardFromPlayers([
      { ticket: 1, name: "Ann", team: "Reds", eliminatedDate: "2026-12-14" },
      { ticket: 2, name: "Ben", team: "Reds", eliminatedDate: "" },
      { ticket: 3, name: "Cy", team: "Blues", eliminatedDate: "2026-12-13" },
    ]);
    assert.strictEqual(board.summary.totalPlayers, 3);
    assert.strictEqual(board.summary.activePlayers, 1);
    assert.strictEqual(board.summary.eliminatedPlayers, 2);
    assert.strictEqual(board.summary.activeTeams, 1);
    assert.strictEqual(board.summary.currentRound, 2);
    assert.strictEqual(board.summary.winner.name, "Ben");
    assert.deepStrictEqual(
      board.teams.map((t) => t.name),
      ["Reds", "Blues"]
    );
    // Oldest date = Day 1, newer date = Day 2; rounds list is newest first
    assert.strictEqual(board.rounds[0].round, 2);
    assert.strictEqual(board.rounds[1].round, 1);
  });

  await test("verifyAdminPasscode accepts configured demoPasscode and rejects wrong passcode", async () => {
    await api.verifyAdminPasscode("mackey");
    await assert.rejects(() => api.verifyAdminPasscode("wrong"), /Incorrect demo passcode/);
  });

  await test("drawEliminations marks chosen players with the date and undo restores them", async () => {
    const initial = api.resetDemoData();
    const startActive = initial.summary.activePlayers;

    const draw = await api.drawEliminations({ passcode: "mackey", count: 3, date: "2026-12-20" });
    assert.strictEqual(draw.eliminated.length, 3);
    assert.strictEqual(draw.board.summary.activePlayers, startActive - 3);

    const undo = await api.undoLastDraw({ passcode: "mackey" });
    assert.strictEqual(undo.undoneDate, "2026-12-20");
    assert.strictEqual(undo.restored.length, 3);
    assert.strictEqual(undo.board.summary.activePlayers, startActive);
  });

  await test("drawEliminations blocks drawing down to zero players", async () => {
    const initial = api.resetDemoData();
    await assert.rejects(
      () => api.drawEliminations({ passcode: "mackey", count: initial.summary.activePlayers, date: "2026-12-20" }),
      /at most/
    );
  });

  console.log(`\n${passed} tests passed`);
})();
