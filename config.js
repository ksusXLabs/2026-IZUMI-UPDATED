const fs = require('fs');
if (fs.existsSync('config.env')) {
    require('dotenv').config({ path: './config.env' });
}

module.exports = {
    // SESSION
    SESSION_ID: process.env.SESSION_ID || "j1ZE2Bpa#vM9wLsjRV5QdP7G2EfTjhl2vKjUS6KbMB6X4eA3TE8U",

    // ALIVE PREVIEW IMAGE (LINK PREVIEW)
    ALIVE_PREVIEW_IMG: process.env.ALIVE_PREVIEW_IMG || "https://files.catbox.moe/xt7238.webp",

    // ALIVE MESSAGE
    ALIVE_MSG: process.env.ALIVE_MSG || 
`👋 𝐇𝐈, {user} 𝐈❜𝐀𝐌 𝐀𝐋𝐈𝐕𝐄 👾

╭─「 \`DATE INFORMATION\` 」
│📅 \`Date\` : {date}
│⏰ \`Time\` : {time}
╰──────────●●►

╭─「 \`STATUS DETAILS\` 」
│👤 \`User\` : {user}
│✒️ \`Prefix\` : !
│🧬 \`Version\` : v1.0.0
│🎈 \`Platform\` : Linux
│📡 \`Host\` : {host}
│📟 \`Uptime\` : {uptime}
│📂 \`Memory\` : {memory}
╰──────────●●►

> 🛠 Developer : Dev.RabbitZz 🥕`,

    // OWNER
    BOT_OWNER: '94752425527',

    // STATUS VIEW
    AUTO_STATUS_SEEN: 'true',

    // STATUS REACT
    AUTO_STATUS_REACT: 'true'
};
