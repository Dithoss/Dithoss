const axios = require("axios");
const fs = require("fs");

const token = process.env.GITLAB_TOKEN;
const username = "Dithoss"; 
const host = "https://dev.hummatech.com";

async function run() {
  const userResp = await axios.get(`${host}/api/v4/users?username=${username}`, {
    headers: { "PRIVATE-TOKEN": token },
  });
  if (!userResp.data || userResp.data.length === 0) {
    throw new Error("User not found");
  }
  const userId = userResp.data[0].id;

  const eventsResp = await axios.get(`${host}/api/v4/users/${userId}/events`, {
    headers: { "PRIVATE-TOKEN": token },
  });

  fs.writeFileSync("activity.json", JSON.stringify(eventsResp.data, null, 2));
}

run().catch(err => {
  console.error(err.response ? err.response.data : err.message);
  process.exit(1);
});
