import React, { useState, useEffect, useCallback, useMemo } from "react";

// ─── SET TO false BEFORE DEPLOYING TO NETLIFY ──────────────
const USE_MOCK_DATA = false;

// ─── MOCK DATA (real standings + fixtures as of Feb 14, 2026) ─
const MOCK_STANDINGS = [
  { team: { id: 58, name: "Aston Villa", shortName: "Aston Villa", crest: "https://crests.football-data.org/58.png" }, playedGames: 26, won: 15, draw: 5, lost: 6, points: 50, goalsFor: 40, goalsAgainst: 28, goalDifference: 12 },
  { team: { id: 66, name: "Manchester United FC", shortName: "Manchester United", crest: "https://crests.football-data.org/66.png" }, playedGames: 26, won: 12, draw: 9, lost: 5, points: 45, goalsFor: 42, goalsAgainst: 33, goalDifference: 9 },
  { team: { id: 61, name: "Chelsea FC", shortName: "Chelsea", crest: "https://crests.football-data.org/61.png" }, playedGames: 26, won: 12, draw: 8, lost: 6, points: 44, goalsFor: 45, goalsAgainst: 31, goalDifference: 14 },
  { team: { id: 64, name: "Liverpool FC", shortName: "Liverpool", crest: "https://crests.football-data.org/64.png" }, playedGames: 26, won: 12, draw: 6, lost: 8, points: 42, goalsFor: 38, goalsAgainst: 36, goalDifference: 2 },
];

const MOCK_MATCHES = [
  // ASTON VILLA remaining
  { id: 101, utcDate: "2026-02-21T15:00:00Z", status: "SCHEDULED", homeTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" }, awayTeam: { id: 341, name: "Leeds United FC", shortName: "Leeds" } },
  { id: 102, utcDate: "2026-02-27T20:00:00Z", status: "SCHEDULED", homeTeam: { id: 76, name: "Wolverhampton Wanderers FC", shortName: "Wolves" }, awayTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" } },
  { id: 103, utcDate: "2026-03-04T19:30:00Z", status: "SCHEDULED", homeTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" }, awayTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" } },
  { id: 104, utcDate: "2026-03-15T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" }, awayTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" } },
  { id: 105, utcDate: "2026-03-22T14:15:00Z", status: "SCHEDULED", homeTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" }, awayTeam: { id: 563, name: "West Ham United FC", shortName: "West Ham" } },
  { id: 106, utcDate: "2026-04-11T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 351, name: "Nottingham Forest FC", shortName: "Nott'm Forest" }, awayTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" } },
  { id: 107, utcDate: "2026-04-18T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" }, awayTeam: { id: 71, name: "Sunderland AFC", shortName: "Sunderland" } },
  { id: 108, utcDate: "2026-04-25T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 63, name: "Fulham FC", shortName: "Fulham" }, awayTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" } },
  { id: 109, utcDate: "2026-05-02T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" }, awayTeam: { id: 73, name: "Tottenham Hotspur FC", shortName: "Tottenham" } },
  { id: 110, utcDate: "2026-05-09T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 328, name: "Burnley FC", shortName: "Burnley" }, awayTeam: { id: 58, name: "Aston Villa", shortName: "Aston Villa" } },
  // CHELSEA remaining
  { id: 201, utcDate: "2026-02-21T15:00:00Z", status: "SCHEDULED", homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" }, awayTeam: { id: 328, name: "Burnley FC", shortName: "Burnley" } },
  { id: 202, utcDate: "2026-03-01T16:30:00Z", status: "SCHEDULED", homeTeam: { id: 57, name: "Arsenal FC", shortName: "Arsenal" }, awayTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" } },
  // 103 = AVL vs CHE (already defined above)
  { id: 204, utcDate: "2026-03-14T17:30:00Z", status: "SCHEDULED", homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" }, awayTeam: { id: 67, name: "Newcastle United FC", shortName: "Newcastle" } },
  { id: 205, utcDate: "2026-03-21T17:30:00Z", status: "SCHEDULED", homeTeam: { id: 62, name: "Everton FC", shortName: "Everton" }, awayTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" } },
  { id: 206, utcDate: "2026-04-11T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" }, awayTeam: { id: 65, name: "Manchester City FC", shortName: "Man City" } },
  { id: 207, utcDate: "2026-04-18T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" }, awayTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" } },
  { id: 208, utcDate: "2026-04-25T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 397, name: "Brighton & Hove Albion FC", shortName: "Brighton" }, awayTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" } },
  { id: 209, utcDate: "2026-05-02T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" }, awayTeam: { id: 351, name: "Nottingham Forest FC", shortName: "Nott'm Forest" } },
  { id: 210, utcDate: "2026-05-09T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" }, awayTeam: { id: 61, name: "Chelsea FC", shortName: "Chelsea" } },
  // LIVERPOOL remaining
  { id: 301, utcDate: "2026-02-22T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 351, name: "Nottingham Forest FC", shortName: "Nott'm Forest" }, awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" } },
  { id: 302, utcDate: "2026-02-28T15:00:00Z", status: "SCHEDULED", homeTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" }, awayTeam: { id: 563, name: "West Ham United FC", shortName: "West Ham" } },
  { id: 303, utcDate: "2026-03-03T20:15:00Z", status: "SCHEDULED", homeTeam: { id: 76, name: "Wolverhampton Wanderers FC", shortName: "Wolves" }, awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" } },
  { id: 304, utcDate: "2026-03-15T16:30:00Z", status: "SCHEDULED", homeTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" }, awayTeam: { id: 73, name: "Tottenham Hotspur FC", shortName: "Tottenham" } },
  { id: 305, utcDate: "2026-03-21T12:30:00Z", status: "SCHEDULED", homeTeam: { id: 397, name: "Brighton & Hove Albion FC", shortName: "Brighton" }, awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" } },
  { id: 306, utcDate: "2026-04-11T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" }, awayTeam: { id: 63, name: "Fulham FC", shortName: "Fulham" } },
  { id: 307, utcDate: "2026-04-18T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 62, name: "Everton FC", shortName: "Everton" }, awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" } },
  { id: 308, utcDate: "2026-04-25T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" }, awayTeam: { id: 354, name: "Crystal Palace FC", shortName: "Crystal Palace" } },
  { id: 309, utcDate: "2026-05-02T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" }, awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool" } },
  // 210 = LIV vs CHE (already defined above)
  // Manchester United remaining
  { id: 401, utcDate: "2026-02-23T20:00:00Z", status: "SCHEDULED", homeTeam: { id: 62, name: "Everton FC", shortName: "Everton" }, awayTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" } },
  { id: 402, utcDate: "2026-03-01T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" }, awayTeam: { id: 354, name: "Crystal Palace FC", shortName: "Crystal Palace" } },
  { id: 403, utcDate: "2026-03-04T20:15:00Z", status: "SCHEDULED", homeTeam: { id: 67, name: "Newcastle United FC", shortName: "Newcastle" }, awayTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" } },
  // 104 = MUN vs AVL (already defined above)
  { id: 405, utcDate: "2026-03-20T20:00:00Z", status: "SCHEDULED", homeTeam: { id: 1044, name: "AFC Bournemouth", shortName: "Bournemouth" }, awayTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" } },
  { id: 406, utcDate: "2026-04-11T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" }, awayTeam: { id: 341, name: "Leeds United FC", shortName: "Leeds" } },
  // 207 = CHE vs MUN (already defined above)
  { id: 408, utcDate: "2026-04-25T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" }, awayTeam: { id: 402, name: "Brentford FC", shortName: "Brentford" } },
  // 309 = MUN vs LIV (already defined above)
  { id: 410, utcDate: "2026-05-09T14:00:00Z", status: "SCHEDULED", homeTeam: { id: 71, name: "Sunderland AFC", shortName: "Sunderland" }, awayTeam: { id: 66, name: "Manchester United FC", shortName: "Manchester United" } },
];

// ─── HELPER: get crest URL for any team ─────────────────────
function getTeamCrest(teamId) {
  return `https://crests.football-data.org/${teamId}.png`;
}

// ─── CONFIG ─────────────────────────────────────────────────
const TRACKED_TEAMS = {
  58: {
    name: "Aston Villa",
    short: "AVL",
    color: "#670E36",
    accent: "#95BFE5",
    crest: "https://crests.football-data.org/58.png",
  },
  61: {
    name: "Chelsea",
    short: "CHE",
    color: "#034694",
    accent: "#DBA111",
    crest: "https://crests.football-data.org/61.png",
  },
  64: {
    name: "Liverpool",
    short: "LIV",
    color: "#C8102E",
    accent: "#F6EB61",
    crest: "https://crests.football-data.org/64.png",
  },
  66: {
    name: "Manchester United",
    short: "MUN",
    color: "#DA291C",
    accent: "#FBE122",
    crest: "https://crests.football-data.org/66.png",
  },
};

// Fixed card order: Chelsea top-left, Man United top-right, Liverpool bottom-left, Aston Villa bottom-right
const CARD_ORDER = [61, 66, 64, 58];

const TRACKED_IDS = [61, 66, 64, 58];

const QUALIFICATION = {
  3: { label: "UCL", className: "ucl" },
  4: { label: "UCL", className: "ucl" },
  5: { label: "UCL", className: "ucl" },
  6: { label: "UEL", className: "uel" },
};

// ─── API HELPERS ────────────────────────────────────────────
async function fetchAPI(path) {
  const res = await fetch(
    `/api/football-api?path=${encodeURIComponent(path)}`
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function isTracked(teamId) {
  return TRACKED_IDS.includes(teamId);
}

// ─── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [standings, setStandings] = useState(null);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data on mount
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let trackedStandings, trackedMatches;

      if (USE_MOCK_DATA) {
        // Use mock data for local development
        trackedStandings = MOCK_STANDINGS;
        trackedMatches = MOCK_MATCHES;
      } else {
        // Fetch from API (works on Netlify)
        const [standingsData, matchesData] = await Promise.all([
          fetchAPI("competitions/PL/standings"),
          fetchAPI("competitions/PL/matches?season=2025"),
        ]);

        const table = standingsData.standings?.[0]?.table || [];
        trackedStandings = table.filter((row) => isTracked(row.team.id));

        const allMatches = matchesData.matches || [];
        trackedMatches = allMatches.filter(
          (m) => isTracked(m.homeTeam?.id) || isTracked(m.awayTeam?.id)
        );
      }

      setStandings(trackedStandings);
      setMatches(trackedMatches);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Separate completed vs remaining matches for each tracked team
  const teamData = useMemo(() => {
    const data = {};

    for (const id of TRACKED_IDS) {
      const teamMatches = matches.filter(
        (m) => m.homeTeam?.id === id || m.awayTeam?.id === id
      );

      const completed = teamMatches.filter(
        (m) => m.status === "FINISHED" || m.status === "AWARDED"
      );
      const remaining = teamMatches.filter(
        (m) =>
          m.status === "SCHEDULED" ||
          m.status === "TIMED" ||
          m.status === "POSTPONED"
      );
      const live = teamMatches.filter(
        (m) =>
          m.status === "IN_PLAY" ||
          m.status === "PAUSED" ||
          m.status === "HALFTIME"
      );

      data[id] = { completed, remaining, live };
    }

    return data;
  }, [matches]);

  // Calculate projected standings
  const projectedStandings = useMemo(() => {
    if (!standings) return [];

    return standings
      .map((row) => {
        const teamId = row.team.id;
        const remaining = teamData[teamId]?.remaining || [];
        let bonusPoints = 0;

        for (const match of remaining) {
          const pred = predictions[match.id];
          if (!pred) continue;

          const isHome = match.homeTeam?.id === teamId;

          if (pred === "HOME_WIN") {
            bonusPoints += isHome ? 3 : 0;
          } else if (pred === "AWAY_WIN") {
            bonusPoints += isHome ? 0 : 3;
          } else if (pred === "DRAW") {
            bonusPoints += 1;
          }
        }

        return {
          ...row,
          projectedPoints: row.points + bonusPoints,
          bonusPoints,
          remainingCount: remaining.length,
          predictedCount: remaining.filter((m) => predictions[m.id])
            .length,
        };
      })
      .sort((a, b) => b.projectedPoints - a.projectedPoints);
  }, [standings, predictions, teamData]);

  // Set prediction — handle linked games
  const setPrediction = useCallback((matchId, result) => {
    setPredictions((prev) => {
      const next = { ...prev };
      if (next[matchId] === result) {
        delete next[matchId]; // Toggle off
      } else {
        next[matchId] = result;
      }
      return next;
    });
  }, []);

  // Find linked match (when two tracked teams play each other)
  const findLinkedInfo = useCallback(
    (match) => {
      const homeId = match.homeTeam?.id;
      const awayId = match.awayTeam?.id;
      if (isTracked(homeId) && isTracked(awayId)) {
        return { isLinked: true, matchId: match.id };
      }
      return { isLinked: false };
    },
    []
  );

  // Helper: find a team's projected position (3-6)
  const getProjectedPosition = useCallback(
    (teamId) => {
      const idx = projectedStandings.findIndex((r) => r.team.id === teamId);
      return idx >= 0 ? idx + 3 : null;
    },
    [projectedStandings]
  );

  // Reset all predictions
  const resetPredictions = () => setPredictions({});

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading Premier League data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-screen">
          <h2>⚠ Unable to load data</h2>
          <p>{error}</p>
          <p className="hint">
            Make sure your <code>FOOTBALL_DATA_API_KEY</code> is set in Netlify
            environment variables.
          </p>
          <button onClick={fetchData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalPredictions = Object.keys(predictions).length;

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-icon"></div>
            <div>
              <h1>
                Flameo Predictor <span className="season">2025/26</span>
              </h1>
            </div>
          </div>
          <div className="header-meta">
            {lastUpdated && (
              <span className="last-updated">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button onClick={fetchData} className="refresh-btn" title="Refresh data">
              ↻
            </button>
          </div>
      </div>
      <div className="header-description">
        <p style={{ color: 'white', textAlign: 'center' }}>
          Predict the remaining Premier League games for Chelsea, 
          Aston Villa, Liverpool, and Manchester United.
        </p>
      </div>
      </header>


      {/* PROJECTED STANDINGS */}
      <section className="standings-section">
        <div className="section-header">
          <h2>Predicted Standings</h2>
          <div className="prediction-progress">
            <span>
             Created by @flameosumeet. 
            </span>
            {totalPredictions > 0 && (
              <button onClick={resetPredictions} className="reset-btn">
                Reset All
              </button>
            )}
          </div>
        </div>

        <div className="standings-table">
          <div className="standings-header">
            <span className="col-pos">#</span>
            <span className="col-team">Team</span>
            <span className="col-pld">MP</span>
            <span className="col-w">W</span>
            <span className="col-d">D</span>
            <span className="col-l">L</span>
            <span className="col-pts">Pts</span>
            <span className="col-proj">Pred.</span>
            <span className="col-qual">Qual.</span>
          </div>

          {projectedStandings.map((row, i) => {
            const pos = i + 3; // Starting from 3rd place
            const qual = QUALIFICATION[pos];
            const team = TRACKED_TEAMS[row.team.id];

            return (
              <div
                key={row.team.id}
                className={`standings-row ${qual?.className || ""}`}
                style={{
                  "--team-color": team?.color,
                  "--team-accent": team?.accent,
                }}
              >
                <span className="col-pos">{pos}</span>
                <span className="col-team">
                  <img
                    src={team?.crest}
                    alt=""
                    className="team-crest"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  {team?.name}
                </span>
                <span className="col-pld">{row.playedGames}</span>
                <span className="col-w">{row.won}</span>
                <span className="col-d">{row.draw}</span>
                <span className="col-l">{row.lost}</span>
                <span className="col-pts">{row.points}</span>
                <span className="col-proj">
                  {row.projectedPoints}
                  {row.bonusPoints > 0 && (
                    <span className="bonus-pts">(+{row.bonusPoints})</span>
                  )}
                </span>
                <span className={`col-qual ${qual?.className || ""}`}>
                  {qual?.label || "—"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="standings-legend">
          <span className="legend-item ucl">
            <span className="legend-dot"></span> Champions League
          </span>
          <span className="legend-item uel">
            <span className="legend-dot"></span> Europa League
          </span>
        </div>
      </section>

      {/* TEAM FIXTURES */}
      <section className="fixtures-section">
        <h2>Remaining Fixtures</h2>
        <p className="fixtures-hint">
          Predictions in fixtures between teams will be linked automatically.
        </p>

        <div className="teams-grid">
          {CARD_ORDER.map((teamId) => {
            const pos = getProjectedPosition(teamId);
            const qual = pos ? QUALIFICATION[pos] : null;
            return (
              <TeamCard
                key={teamId}
                teamId={teamId}
                teamInfo={TRACKED_TEAMS[teamId]}
                remaining={teamData[teamId]?.remaining || []}
                live={teamData[teamId]?.live || []}
                predictions={predictions}
                setPrediction={setPrediction}
                findLinkedInfo={findLinkedInfo}
                position={pos}
                qualification={qual}
              />
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          Flameo Predictor — <a href="https://skjsports.com" target="_blank" rel="noopener noreferrer">SKJ Sports</a>
        </p>
        <p className="footer-small">
          Data from{" "}
          <a href="https://www.football-data.org" target="_blank" rel="noopener noreferrer">
            football-data.org
          </a>
          . Refreshes every 5 minutes.
        </p>
      </footer>
    </div>
  );
}

// ─── TEAM CARD COMPONENT ────────────────────────────────────
function TeamCard({
  teamId,
  teamInfo,
  remaining,
  live,
  predictions,
  setPrediction,
  findLinkedInfo,
  position,
  qualification,
}) {
  const projectedBonus = remaining.reduce((pts, m) => {
    const pred = predictions[m.id];
    if (!pred) return pts;
    const isHome = m.homeTeam?.id === teamId;
    if (pred === "HOME_WIN") return pts + (isHome ? 3 : 0);
    if (pred === "AWAY_WIN") return pts + (isHome ? 0 : 3);
    if (pred === "DRAW") return pts + 1;
    return pts;
  }, 0);

  return (
    <div
      className="team-card"
      style={{
        "--team-color": teamInfo.color,
        "--team-accent": teamInfo.accent,
      }}
    >
      <div className="team-card-header">
        <img
          src={teamInfo.crest}
          alt=""
          className="team-card-crest"
          onError={(e) => (e.target.style.display = "none")}
        />
        <div>
          <h3>{teamInfo.name}</h3>
          <span className="team-card-meta">
            {projectedBonus > 0 && (
              <span className="team-bonus"> +{projectedBonus} pts</span>
            )}
          </span>
        </div>
      {qualification && (
        <span className={`team-card-badge ${qualification.className}`}>
          {position}{position === 3 ? "rd" : "th"} · {qualification.label}
        </span>
      )}
      </div>

      <div className="fixtures-list">
        {live.length > 0 &&
          live.map((match) => (
            <MatchRow
              key={match.id}
              match={match}
              teamId={teamId}
              isLive={true}
              prediction={predictions[match.id]}
              setPrediction={setPrediction}
              findLinkedInfo={findLinkedInfo}
            />
          ))}

        {remaining.length === 0 ? (
          <p className="no-fixtures">No remaining fixtures</p>
        ) : (
          remaining.map((match) => (
            <MatchRow
              key={match.id}
              match={match}
              teamId={teamId}
              isLive={false}
              prediction={predictions[match.id]}
              setPrediction={setPrediction}
              findLinkedInfo={findLinkedInfo}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── MATCH ROW COMPONENT ────────────────────────────────────
function MatchRow({
  match,
  teamId,
  isLive,
  prediction,
  setPrediction,
  findLinkedInfo,
}) {
  const isHome = match.homeTeam?.id === teamId;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const opponentTracked = isTracked(opponent?.id);
  const opponentInfo = TRACKED_TEAMS[opponent?.id];
  const { isLinked } = findLinkedInfo(match);

  const matchDate = new Date(match.utcDate);
  const dateStr = matchDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  // Full display name for the opponent
  const opponentName = opponentTracked
    ? opponentInfo?.name
    : (opponent?.shortName || opponent?.name || "TBD");

  // Convert team-perspective result (W/D/L) to the actual match result (HOME_WIN/DRAW/AWAY_WIN)
  const toMatchResult = (teamResult) => {
    if (teamResult === "W") return isHome ? "HOME_WIN" : "AWAY_WIN";
    if (teamResult === "L") return isHome ? "AWAY_WIN" : "HOME_WIN";
    return "DRAW";
  };

  // Convert actual match result to team-perspective result for display
  const toTeamResult = (matchResult) => {
    if (matchResult === "HOME_WIN") return isHome ? "W" : "L";
    if (matchResult === "AWAY_WIN") return isHome ? "L" : "W";
    return "D";
  };

  // Get the CSS class for a button based on team-perspective result
  const getButtonClass = (teamResult) => {
    const matchResult = toMatchResult(teamResult);
    if (prediction !== matchResult) return "";
    if (teamResult === "W") return "selected-win";
    if (teamResult === "L") return "selected-loss";
    return "selected-draw";
  };

  // Points for team-perspective result
  const getPoints = (teamResult) => {
    if (teamResult === "W") return 3;
    if (teamResult === "D") return 1;
    return 0;
  };

  // Current prediction in team-perspective terms
  const currentTeamResult = prediction ? toTeamResult(prediction) : null;

  return (
    <div className={`match-row ${isLive ? "live" : ""}`}>
      <div className="match-info">
        <span className="match-date">{dateStr}</span>
        <span className="match-venue">{isHome ? "H" : "A"}</span>
        <span className="match-opponent">
          <img
            src={getTeamCrest(opponent?.id)}
            alt=""
            className="opponent-crest"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span>
            {opponentName}
          </span>
          {isLinked && <span className="linked-badge" title="Linked — prediction applies to both teams">⭐</span>}
        </span>
      </div>

      <div className="match-predictions">
        {isLive && (
          <span className="live-badge">LIVE</span>
        )}
        {["W", "D", "L"].map((teamResult) => {
          const matchResult = toMatchResult(teamResult);
          return (
            <button
              key={teamResult}
              className={`pred-btn ${getButtonClass(teamResult)}`}
              onClick={() => setPrediction(match.id, matchResult)}
              title={`${teamResult} (${getPoints(teamResult)} pts)`}
            >
              {teamResult}
            </button>
          );
        })}
        {currentTeamResult && (
          <span className="pts-badge">+{getPoints(currentTeamResult)}</span>
        )}
      </div>
    </div>
  );
}