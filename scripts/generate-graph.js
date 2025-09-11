// scripts/generate-graph.js
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");

const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function main() {
  const activity = JSON.parse(fs.readFileSync(process.argv[2]));
  const outFile = process.argv[3];

  // Contoh: hitung jumlah aktivitas per hari
  const counts = {};
  activity.forEach(ev => {
    const date = ev.created_at.slice(0, 10);
    counts[date] = (counts[date] || 0) + 1;
  });

  const labels = Object.keys(counts).sort();
  const data = labels.map(l => counts[l]);

  const config = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "GitLab Contributions",
          data,
          fill: false,
        },
      ],
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(config, "image/svg+xml");
  fs.writeFileSync(outFile, image);
  console.log(`Saved ${outFile}`);
}

main();
