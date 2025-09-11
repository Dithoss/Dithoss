const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");

async function run() {
  const args = process.argv;
  if (args.length < 4) {
    console.error("Usage: node generate-graph.js <input-json> <output-svg>");
    process.exit(1);
  }

  const inFile = args[2];
  const outFile = args[3];

  if (!fs.existsSync(inFile)) {
    console.error("Input file not found:", inFile);
    process.exit(1);
  }

  const raw = fs.readFileSync(inFile);
  const activity = JSON.parse(raw);

  const counts = {};
  activity.forEach(evt => {
    const d = evt.created_at.substring(0, 10);
    counts[d] = (counts[d] || 0) + 1;
  });

  const labels = Object.keys(counts).sort();
  const data = labels.map(l => counts[l] || 0);

  const width = 800;
  const height = 200;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "GitLab Activity",
        data: data,
        fill: false,
        borderColor: "blue",
      }],
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { autoSkip: true, maxTicksLimit: 20 } } }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config, "image/svg+xml");
  fs.writeFileSync(outFile, buffer);
  console.log("Graph saved to", outFile);
}

run().catch(err => {
  console.error("Error generating graph:", err);
  process.exit(1);
});
