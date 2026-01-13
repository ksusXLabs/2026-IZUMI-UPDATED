const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/9fn3ay.png",
ALIVE_MSG: process.env.ALIVE_MSG || "*Hello👋 IZUMI-LITE Is Alive Now😍*",
BOT_OWNER: '94752425527',  // Replace with the owner's phone number



};
