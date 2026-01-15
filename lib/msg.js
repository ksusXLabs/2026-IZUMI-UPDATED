const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const fs = require('fs')

/* ================= MEDIA DOWNLOAD ================= */

const downloadMediaMessage = async (m, filename) => {
	if (m.type === 'viewOnceMessage') {
		m.type = m.msg.type
	}

	if (m.type === 'imageMessage') {
		const name = filename ? filename + '.jpg' : 'undefined.jpg'
		const stream = await downloadContentFromMessage(m.msg, 'image')
		let buffer = Buffer.from([])
		for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
		fs.writeFileSync(name, buffer)
		return fs.readFileSync(name)

	} else if (m.type === 'videoMessage') {
		const name = filename ? filename + '.mp4' : 'undefined.mp4'
		const stream = await downloadContentFromMessage(m.msg, 'video')
		let buffer = Buffer.from([])
		for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
		fs.writeFileSync(name, buffer)
		return fs.readFileSync(name)

	} else if (m.type === 'audioMessage') {
		const name = filename ? filename + '.mp3' : 'undefined.mp3'
		const stream = await downloadContentFromMessage(m.msg, 'audio')
		let buffer = Buffer.from([])
		for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
		fs.writeFileSync(name, buffer)
		return fs.readFileSync(name)

	} else if (m.type === 'stickerMessage') {
		const name = filename ? filename + '.webp' : 'undefined.webp'
		const stream = await downloadContentFromMessage(m.msg, 'sticker')
		let buffer = Buffer.from([])
		for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
		fs.writeFileSync(name, buffer)
		return fs.readFileSync(name)

	} else if (m.type === 'documentMessage') {
		const ext = m.msg.fileName.split('.').pop().toLowerCase()
			.replace('jpeg', 'jpg')
			.replace('png', 'jpg')
			.replace('m4a', 'mp3')

		const name = filename ? `${filename}.${ext}` : `undefined.${ext}`
		const stream = await downloadContentFromMessage(m.msg, 'document')
		let buffer = Buffer.from([])
		for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
		fs.writeFileSync(name, buffer)
		return fs.readFileSync(name)
	}
}

/* ================= MENU STATE ================= */

const menuState = {}

/* ================= MESSAGE WRAPPER ================= */

const sms = async (danuwa, m) => {
	if (m.key) {
		m.id = m.key.id
		m.chat = m.key.remoteJid
		m.fromMe = m.key.fromMe
		m.isGroup = m.chat.endsWith('@g.us')
		m.sender = m.fromMe
			? danuwa.user.id.split(':')[0] + '@s.whatsapp.net'
			: m.isGroup
				? m.key.participant
				: m.key.remoteJid
	}

	if (m.message) {
		m.type = getContentType(m.message)
		m.msg = (m.type === 'viewOnceMessage')
			? m.message[m.type].message[getContentType(m.message[m.type].message)]
			: m.message[m.type]

		if (m.msg) {
			if (m.type === 'viewOnceMessage') {
				m.msg.type = getContentType(m.message[m.type].message)
			}

			const quotedMention = m.msg.contextInfo?.participant || ''
			const tagMention = m.msg.contextInfo?.mentionedJid || []
			const mention = (typeof tagMention === 'string' ? [tagMention] : tagMention)
			mention.push(quotedMention)
			m.mentionUser = mention.filter(Boolean)

			m.body =
				m.type === 'conversation' ? m.msg :
				m.type === 'extendedTextMessage' ? m.msg.text :
				m.type === 'imageMessage' && m.msg.caption ? m.msg.caption :
				m.type === 'videoMessage' && m.msg.caption ? m.msg.caption :
				m.type === 'buttonsResponseMessage' ? m.msg.selectedButtonId :
				m.type === 'templateButtonReplyMessage' ? m.msg.selectedId :
				''

			m.quoted = m.msg.contextInfo?.quotedMessage || null

			if (m.quoted) {
				m.quoted.type = getContentType(m.quoted)
				m.quoted.id = m.msg.contextInfo.stanzaId
				m.quoted.sender = m.msg.contextInfo.participant
				m.quoted.fromMe = m.quoted.sender.includes(danuwa.user.id.split(':')[0])
				m.quoted.msg =
					m.quoted.type === 'viewOnceMessage'
						? m.quoted[m.quoted.type].message[getContentType(m.quoted[m.quoted.type].message)]
						: m.quoted[m.quoted.type]

				m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
					key: {
						remoteJid: m.chat,
						fromMe: m.quoted.fromMe,
						id: m.quoted.id,
						participant: m.quoted.sender
					},
					message: m.quoted
				})

				m.quoted.download = (filename) => downloadMediaMessage(m.quoted, filename)
				m.quoted.delete = () => danuwa.sendMessage(m.chat, { delete: m.quoted.fakeObj.key })
				m.quoted.react = (emoji) => danuwa.sendMessage(m.chat, { react: { text: emoji, key: m.quoted.fakeObj.key } })
			}
		}

		m.download = (filename) => downloadMediaMessage(m, filename)
	}

	/* ================= REPLY HELPERS ================= */

	m.reply = (text, id = m.chat) =>
		danuwa.sendMessage(id, { text }, { quoted: m })

	m.replyImg = (img, text) =>
		danuwa.sendMessage(m.chat, { image: img, caption: text }, { quoted: m })

	m.replyVid = (vid, text, gif = false) =>
		danuwa.sendMessage(m.chat, { video: vid, caption: text, gifPlayback: gif }, { quoted: m })

	m.replyAud = (aud, ptt = false) =>
		danuwa.sendMessage(m.chat, { audio: aud, ptt, mimetype: 'audio/mpeg' }, { quoted: m })

	m.react = (emoji) =>
		danuwa.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

	/* ================= MENU NUMBER HANDLER ================= */

	if (menuState[m.chat] && /^\d+$/.test(m.body)) {
		const { categories, catNames } = menuState[m.chat]
		const index = parseInt(m.body) - 1
		const cat = catNames[index]

		if (cat) {
			let text = `📂 *${cat.toUpperCase()} COMMANDS*\n\n`
			categories[cat].forEach(c => {
				text += `• .${c.pattern}\n  └ ${c.desc}\n\n`
			})
			delete menuState[m.chat]
			await danuwa.sendMessage(m.chat, { text: text.trim() })
		}
	}

	return m
}

module.exports = {
	sms,
	downloadMediaMessage,
	menuState
}
