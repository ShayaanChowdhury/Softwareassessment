const battingData = JSON.parse(localStorage.getItem("battingData")) || [];
const bowlingData = JSON.parse(localStorage.getItem("bowlingData")) || [];

let highScore = battingData.reduce((max, session) => Math.max(max, session.runs), 0);
let bestBowling = bowlingData.reduce(
    (best, session) =>
        session.wickets > best.wickets ||
        (session.wickets === best.wickets && session.runsGiven < best.runsGiven)
            ? session
            : best,
    { wickets: 0, runsGiven: Infinity }
);

const formatBestBowling = (stats) => `${stats.wickets}/${stats.runsGiven}`;

function saveStats() {
    const runs = parseInt(document.getElementById("runs").value) || 0;
    const balls = parseInt(document.getElementById("balls").value) || 0;
    const wickets = parseInt(document.getElementById("wickets").value) || 0;
    const runsGiven = parseInt(document.getElementById("runsGiven").value) || 0;
    const oversBowled = parseFloat(document.getElementById("oversBowled").value) || 0;
    const notOut = document.getElementById("notOut").checked;
    const fours = parseInt(document.getElementById("fours").value) || 0;
    const sixes = parseInt(document.getElementById("sixes").value) || 0;
    const catches = parseInt(document.getElementById("catches").value) || 0;

    const battingSession = { runs, balls, notOut, fours, sixes, catches };
    battingData.push(battingSession);
    if (runs > highScore) highScore = runs;

    const bowlingSession = { wickets, runsGiven, overs: oversBowled };
    bowlingData.push(bowlingSession);
    if (
        wickets > bestBowling.wickets ||
        (wickets === bestBowling.wickets && runsGiven < bestBowling.runsGiven)
    ) {
        bestBowling = { wickets, runsGiven };
    }

    localStorage.setItem("battingData", JSON.stringify(battingData));
    localStorage.setItem("bowlingData", JSON.stringify(bowlingData));

    alert("Stats saved successfully!");
    updateStatsDisplay();
}

function updateBattingStats() {
    const totalRuns = battingData.reduce((sum, session) => sum + session.runs, 0);
    const totalBalls = battingData.reduce((sum, session) => sum + session.balls, 0);
    const totalInnings = battingData.length;
    const totalNotOuts = battingData.filter((session) => session.notOut).length;
    const battingAverage =
        totalInnings - totalNotOuts > 0
            ? (totalRuns / (totalInnings - totalNotOuts)).toFixed(2)
            : "N/A";
    const strikeRate = totalBalls > 0 ? ((totalRuns / totalBalls) * 100).toFixed(2) : "N/A";

    document.getElementById("battingStats").innerHTML = `
        <table>
            <tr><th>Matches</th><th>Runs</th><th>HS</th><th>Avg</th><th>SR</th><th>4s</th><th>6s</th><th>Ct</th></tr>
            <tr>
                <td>${totalInnings}</td>
                <td>${totalRuns}</td>
                <td>${highScore}</td>
                <td>${battingAverage}</td>
                <td>${strikeRate}</td>
                <td>${battingData.reduce((sum, session) => sum + session.fours, 0)}</td>
                <td>${battingData.reduce((sum, session) => sum + session.sixes, 0)}</td>
                <td>${battingData.reduce((sum, session) => sum + session.catches, 0)}</td>
            </tr>
        </table>
    `;
}

function updateBowlingStats() {
    const totalOvers = bowlingData.reduce((sum, session) => sum + session.overs, 0);
    const totalWickets = bowlingData.reduce((sum, session) => sum + session.wickets, 0);
    const totalRunsGiven = bowlingData.reduce((sum, session) => sum + session.runsGiven, 0);
    const bowlingAverage =
        totalWickets > 0 ? (totalRunsGiven / totalWickets).toFixed(2) : "N/A";
    const economyRate = totalOvers > 0 ? (totalRunsGiven / totalOvers).toFixed(2) : "N/A";

    document.getElementById("bowlingStats").innerHTML = `
        <table>
            <tr><th>Matches</th><th>Overs</th><th>Wickets</th><th>Best</th><th>Avg</th><th>Econ</th><th>Runs</th></tr>
            <tr>
                <td>${bowlingData.length}</td>
                <td>${totalOvers.toFixed(1)}</td>
                <td>${totalWickets}</td>
                <td>${formatBestBowling(bestBowling)}</td>
                <td>${bowlingAverage}</td>
                <td>${economyRate}</td>
                <td>${totalRunsGiven}</td>
            </tr>
        </table>
    `;
}

function updateStatsDisplay() {
    updateBattingStats();
    updateBowlingStats();
}

updateStatsDisplay();