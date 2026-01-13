const { cmd } = require('../command');
const axios = require('axios');

function isYouTubeUrl(text) {
    return text.includes("youtu.be") || text.includes("youtube.com");
}

cmd({
    pattern: "song",
    desc: "Download song by name or YouTube URL",
    category: "download",
    filename: __filename
},
async (ksasmitha, mek, m, {
    from, q, reply
}) => {
    try {
        if (!q) {
            return reply("❌ Song name or YouTube URL required\n\nExample:\n.song faded\n.song https://youtu.be/xxxx");
        }

        reply("🔄 Processing...");

        let ytUrl;
        let thumbnail = "";
        let title = "";
        let channel = "";
        let duration = "";
        let views = "";

        /* ---------- If input is YouTube URL ---------- */
        if (isYouTubeUrl(q)) {
            ytUrl = q;

        } else {
            /* ---------- Search by name ---------- */
            const searchUrl = `https://www.movanest.xyz/v2/yts?q=${encodeURIComponent(q)}`;
            const searchRes = await axios.get(searchUrl);

            if (!searchRes.data?.results?.length) {
                return reply("❌ No results found.");
            }

            const video = searchRes.data.results[0];
            ytUrl = video.url;
            thumbnail = video.thumbnail;
            title = video.title;
            channel = video.channel;
            duration = video.duration;
            views = video.views;
        }

        /* ---------- Convert to MP3 ---------- */
        const apiUrl = `https://www.movanest.xyz/v2/ytmp3-2?url=${encodeURIComponent(ytUrl)}`;
        const res = await axios.get(apiUrl);

        if (!res.data?.results?.downloadUrl) {
            return reply("❌ Failed to download audio.");
        }

        const data = res.data.results;

        /* ---------- Fallback details (URL input) ---------- */
        title = title || data.title;
        channel = channel || data.channel;
        duration = duration || data.duration;
        views = views || data.views;

        /* ---------- Caption ---------- */
        const caption =
`🎵 *Song Downloaded*

📌 *Title:* ${title}
👤 *Channel:* ${channel}
⏱ *Duration:* ${duration}
👁 *Views:* ${views}

> IZUMI-LITE 🎧`;

        /* ---------- Send thumbnail + details ---------- */
        if (thumbnail) {
            await ksasmitha.sendMessage(from, {
                image: { url: thumbnail },
                caption
            }, { quoted: mek });
        } else {
            await reply(caption);
        }

        /* ---------- Send audio ---------- */
        await ksasmitha.sendMessage(from, {
            audio: { url: data.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: data.filename
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("❌ Error occurred while processing the song.");
    }
});
