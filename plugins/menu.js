const { cmd, commands } = require("../command");

const menuState = {}; // chat-based memory

cmd(
  {
    pattern: "menu",
    desc: "Show command categories",
    category: "main",
    filename: __filename,
  },
  async (ksasmitha, mek, m, { from, reply }) => {
    try {

      // BUILD CATEGORY MAP
      const categories = {};
      for (let name in commands) {
        const c = commands[name];
        const cat = c.category?.toLowerCase() || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({
          pattern: c.pattern,
          desc: c.desc || "No description"
        });
      }

      const catNames = Object.keys(categories);

      // FAKE META
      const meta = {
        key: {
          participant: `13135550002@s.whatsapp.net`,
          remoteJid: `13135550002@s.whatsapp.net`,
          fromMe: false,
          id: 'FAKE_META_ukqw2pzpid'
        },
        message: {
          contactMessage: {
            displayName: 'RabbitZz',
            vcard: `BEGIN:VCARD
VERSION:3.0
N:Sazzy;;;;
FN:Sazyy
TEL;waid=13135550002:+1 313 555 0002
END:VCARD`
          }
        },
        pushName: 'Meta AI'
      };

      // SAVE STATE
      menuState[from] = {
        categories,
        catNames
      };

      // SEND CATEGORY MENU
      let menuText = `📋 *COMMAND CATEGORIES*\n\nReply with the number 👇\n\n`;
      catNames.forEach((c, i) => {
        menuText += `${i + 1}. ${c.toUpperCase()}\n`;
      });

      await ksasmitha.sendMessage(
        from,
        {
          text: menuText.trim(),
          contextInfo: {
            externalAdReply: {
              title: "IZUMI-LITE BOT MENU",
              body: "Reply with category number",
              thumbnailUrl: "https://files.catbox.moe/xt7238.webp",
              sourceUrl: "https://files.catbox.moe/xt7238.webp",
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: meta }
      );

    } catch (err) {
      console.error(err);
      reply("❌ Error generating menu.");
    }
  }
);
