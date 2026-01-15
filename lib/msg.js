const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const fs = require('fs')

// 🔗 menu state (shared with menu.js)
const { menuState } = require('../command/menuState')

// ================= DOWNLOAD MEDIA =================
const downloadMediaMessage = async (m, filename) => {
    if (m.type === 'viewOnceMessage') {
        m.type = m.msg.type
    }

    let buffer = Buffer.from([])

    if (m.type === 'imageMessage') {
        const stream = await downloadContentFromMessage(m.msg, 'image')
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const name = filename ? filename + '.jpg' : 'undefined.jpg'
        fs.writeFileSync(name, buffer)
        return buffer

    } else if (m.type === 'videoMessage') {
        const stream = await downloadContentFromMessage(m.msg, 'video')
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const name = filename ? filename + '.mp4' : 'undefined.mp4'
        fs.writeFileSync(name, buffer)
        return buffer

    } else if (m.type === 'audioMessage') {
        const stream = await downloadContentFromMessage(m.msg, 'audio')
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const name = filename ? filename + '.mp3' : 'undefined.mp3'
        fs.writeFileSync(name, buffer)
        return buffer

    } else if (m.type === 'stickerMessage') {
        const stream = await downloadContentFromMessage(m.msg, 'sticker')
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const name = filename ? filename + '.webp' : 'undefined.webp'
        fs.writeFileSync(name, buffer)
        return buffer

    } else if (m.type === 'documentMessage') {
        const ext = m.msg.fileName.split('.').pop()
        const stream = await downloadContentFromMessage(m.msg, 'document')
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        const name = filename ? filename + '.' + ext : 'undefined.' + ext
        fs.writeFileSync(name, buffer)
        return buffer
    }
}

// ================= MESSAGE SERIALIZER =================
const sms = (danuwa, m) => {

    if (m.key) {
        m.id = m.key.id
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = m.fromMe
            ? danuwa.user.id.split(':')[0] + '@s.whatsapp.net'
            : m.isGroup
                ? m.key.participant
                : m.chat
    }

    if (m.message) {
        m.type = getContentType(m.message)
        m.msg = (m.type === 'viewOnceMessage')
            ? m.message[m.type].message[getContentType(m.message[m.type].message)]
            : m.message[m.type]

        m.body =
            m.type === 'conversation' ? m.msg :
            m.type === 'extendedTextMessage' ? m.msg.text :
            (m.type === 'imageMessage' || m.type === 'videoMessage') && m.msg.caption ? m.msg.caption :
            ''

        // quoted
        if (m.msg?.contextInfo?.quotedMessage) {
            m.quoted = m.msg.contextInfo.quotedMessage
            m.quoted.type = getContentType(m.quoted)
            m.quoted.msg = m.quoted[m.quoted.type]
            m.quoted.sender = m.msg.contextInfo.participant
            m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
                key: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.msg.contextInfo.stanzaId,
                    participant: m.quoted.sender
                },
                message: m.quoted
            })
        }
    }

    // ================= QUICK REPLIES =================
    m.reply = (text, opt = {}) =>
        danuwa.sendMessage(m.chat, {
            text,
            contextInfo: opt.contextInfo
        }, { quoted: opt.quoted || m })

    m.download = (filename) => downloadMediaMessage(m, filename)

    // ================= MENU NUMBER HANDLER =================
    // 1 / 2 / 3 reply logic
    if (menuState[m.chat] && /^\d+$/.test(m.body || '')) {
        const index = parseInt(m.body) - 1
        const { categories, catNames } = menuState[m.chat]

        if (catNames[index]) {
            const cat = catNames[index]
            let text = `📂 *${cat.toUpperCase()} COMMANDS*\n\n`

            categories[cat].forEach(cmd => {
                text += `• .${cmd.pattern}\n  └ ${cmd.desc}\n\n`
            })

            // 🧠 FAKE META
            const fakeMeta = {
                key: {
                    participant: `13135550002@s.whatsapp.net`,
                    remoteJid: `13135550002@s.whatsapp.net`,
                    fromMe: false,
                    id: 'FAKE_META_MENU'
                },
                message: {
                    contactMessage: {
                        displayName: 'RabbitZz',
                        vcard: `BEGIN:VCARD
VERSION:3.0
FN:Sazyy
TEL;waid=13135550002:+1 313 555 0002
END:VCARD`
                    }
                }
            }

            await danuwa.sendMessage(
                m.chat,
                {
                    image: { url: 'https://files.catbox.moe/xt7238.webp' },
                    caption: text.trim()
                },
                { quoted: fakeMeta }
            )

            delete menuState[m.chat]
        }
    }

    return m
}

module.exports = { sms, downloadMediaMessage }
