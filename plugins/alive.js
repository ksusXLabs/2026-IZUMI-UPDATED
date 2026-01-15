const { cmd } = require('../command');
const config = require('../config');
const os = require('os');

cmd({
    pattern: "alive",
    desc: "Check bot online status",
    category: "main",
    filename: __filename
},
async (ksasmitha, mek, m, {
    from, reply
}) => {
    try {

        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        const uptime = process.uptime();
        const memory = `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`;
        const host = os.hostname();

        let caption = config.ALIVE_MSG
            .replace(/{user}/g, m.pushName || "User")
            .replace(/{date}/g, date)
            .replace(/{time}/g, time)
            .replace(/{host}/g, host)
            .replace(/{uptime}/g, `${Math.floor(uptime)}s`)
            .replace(/{memory}/g, memory);

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

        // SEND ONLY LINK PREVIEW (NO IMAGE MESSAGE)
        await ksasmitha.sendMessage(from, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: "IZUMI-LITE BOT",
                    body: "Powered by Dev.RabbitZz 🥕",
                    thumbnailUrl: config.ALIVE_PREVIEW_IMG,
                    sourceUrl: config.ALIVE_PREVIEW_IMG,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: meta });

    } catch (e) {
        console.log(e);
        reply(String(e));
    }
});
