const fs = require('fs');
if (fs.existsSync('config.env')) {
    require('dotenv').config({ path: './config.env' });
}

module.exports = {
    // SESSION
    SESSION_ID: process.env.SESSION_ID || "j1ZE2Bpa#vM9wLsjRV5QdP7G2EfTjhl2vKjUS6KbMB6X4eA3TE8U",

    // ALIVE SETTINGS
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/9fn3ay.png",

    ALIVE_MSG: process.env.ALIVE_MSG || 
`👋 𝐇𝐈, {user} 𝐈❜𝐀𝐌 𝐀𝐋𝐈𝐕𝐄 👾

╭─「 ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ 」
│📅 Date : {date}
│⏰ Time : {time}
╰──────────●●►

╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」
│👤 User : {user}
│✒️ Prefix : !
│🧬 Version : v1.0.0
│🎈 Platform : Linux
│📡 Host : {host}
│📟 Uptime : {uptime}
│📂 Memory : {memory}
╰──────────●●►

🛠 Developer : Dev.RabbitZz 🥕`,

    // OWNER
    BOT_OWNER: '94752425527'
};
