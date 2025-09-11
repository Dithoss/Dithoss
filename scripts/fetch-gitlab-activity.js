const axios = require("axios");
const fs = require("fs");

const token = process.env.GITLAB_TOKEN;
const username = "Dithoss"; 
const host = "https://dev.hummatech.com";

async function main() {
  try {
    const users = await axios.get(`${host}/api/v4/users?username=${username}`, {
      headers: { "PRIVATE-TOKEN": token },
    });
    if (!users.data.length) throw new Error("User not found");
    const userId = users.data[0].id;

    const events = await axios.get(`${host}/api/v4/users/${userId}/events`, {
      headers: { "PRIVATE-TOKEN": token },
    });

    fs.writeFileSync("activity.json", JSON.stringify(events.data, null, 2));
    console.log("Saved activity.json");
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

main();
