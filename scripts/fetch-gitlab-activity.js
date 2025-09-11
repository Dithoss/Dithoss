const axios = require("axios");
const fs = require("fs");

const token = process.env.GITLAB_TOKEN;
const username = "Dithoss"; 
const host = "https://dev.hummatech.com"; 

async function run() {
  try {
    if (!token) {
      throw new Error("Missing GITLAB_TOKEN env");
    }

    const userResp = await axios.get(`${host}/api/v4/users?username=${username}`, {
      headers: { "PRIVATE-TOKEN": token },
    });

    if (!userResp.data || userResp.data.length === 0) {
      throw new Error("User not found");
    }
    const userId = userResp.data[0].id;
    console.log("✅ Found userId:", userId);

    const eventsResp = await axios.get(`${host}/api/v4/users/${userId}/events`, {
      headers: { "PRIVATE-TOKEN": token },
    });

    if (!Array.isArray(eventsResp.data) || eventsResp.data.length === 0) {
      throw new Error("No events found for this user");
    }

    fs.writeFileSync("activity.json", JSON.stringify(eventsResp.data, null, 2));
    console.log("✅ Saved activity.json with", eventsResp.data.length, "events");
  } catch (err) {
    console.error("❌ Error fetching GitLab activity:", err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();
