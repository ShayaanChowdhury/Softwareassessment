// Save stats via API
document.getElementById("statsForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const stats = {
      format: document.getElementById("gameFormat").value,
      runs: +document.getElementById("runs").value,
      balls: +document.getElementById("balls").value,
      wickets: +document.getElementById("wickets").value || 0,
      runsGiven: +document.getElementById("runsGiven").value || 0,
      oversBowled: +document.getElementById("oversBowled").value || 0,
      notOut: document.getElementById("notOut").checked,
      fours: +document.getElementById("fours").value || 0,
      sixes: +document.getElementById("sixes").value || 0,
      catches: +document.getElementById("catches").value || 0,
    };
    const response = await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    alert(response.ok ? "Stats saved successfully!" : "Failed to save stats.");
  });
  
  // Fetch stats for a given type
  async function fetchStats(type) {
    const response = await fetch(`/api/stats/${type}`);
    const stats = await response.json();
    const container = document.getElementById(`${type}Stats`);
    container.innerHTML = `
      <table>
        <thead>
          <tr><th>Matches</th><th>Runs</th><th>HS</th><th>Avg</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>${stats.matches}</td>
            <td>${stats.runs}</td>
            <td>${stats.highScore}</td>
            <td>${stats.average.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>`;
  }
  