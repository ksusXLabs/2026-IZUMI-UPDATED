const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "song",
    desc: "Download song as MP3",
    category: "download",
    filename: __filename
},
async (ksasmitha, mek, m, {
    from, q, reply
}) => {
    try {
        if (!q) return reply("❌ Song name ekak hari YouTube link ekak hari denna.\n\nExample:\n.song sindagana slowed");

        reply("⏳ Song eka hoyagena inne...");

        const apiUrl = `https://api.eypz.xo.je/api/ytmp3?url=${encodeURIComponent(q)}&format=128`;
        const { data } = await axios.get(apiUrl);

        if (!data.status) {
            return reply("❌ Song eka download karanna beri una.");
        }

        const res = data.result;

        let caption = `🎵 *${res.title}*\n` +
                      `👤 ${res.uploader}\n` +
                      `⏱ ${res.duration}s\n` +
                      `🎧 128kbps`;

        // Thumbnail + song info
        await ksasmitha.sendMessage(from, {
            image: { url: res.thumbnail },
            caption: caption
        }, { quoted: mek });

        // Send MP3
        await ksasmitha.sendMessage(from, {
            audio: { url: res.download_url },
            mimetype: "audio/mpeg",
            fileName: res.filename
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error ekak awilla. Passe try karanna.");
    }
});
