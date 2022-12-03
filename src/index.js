const Whatsapp = require('@wppconnect-team/wppconnect')
const db = require('./db')
const stages = require('./stages')

const cliente = Whatsapp.create({
	session: 'Whatsapp',
	catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {},
	statusFind: (statusSession, session) => {
		console.log('Status da Sess�o: ', statusSession, '\n')
		console.log('Nome da Sess�o: ', session, '\n')
	},
	folderNameToken: 'tokens',
	headless: true,
	useChrome: true,
	disableWelcome: true,
	autoClose: 60000,
	createPathFileToken: true,
})

cliente
	.then((client) => {
		start(client)
	})
	.catch((erro) => {
		console.log(erro)
	})

Whatsapp.defaultLogger.level = 'silly'
async function start(client) {
	async function sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time))
	}
	await sleep(3000)

	client.onMessage(async (message) => {
		if (typeof message != 'undefined') {
			client.startTyping(message.from)
		}
		;(function () {
			stages.step[getStage(message.from)].obj.execute(message)
		})()
		if (typeof message != 'undefined') {
			client.stopTyping(message.from)
		}
	})
	// client.onStateChange((state) => {
	// 	console.log('State changed: ', state)
	// 	if ('CONFLICT'.includes(state)) client.useHere()
	// 	if ('UNPAIRED'.includes(state)) console.log('logout')
	// })
	client.onIncomingCall(async (call) => {
		console.log(call)
		client.sendText(call.peerJid, "Sorry, I still can't answer calls")
	})
}

function getStage(user) {
	if (db[user]) {
		return db[user].stage
	} else {
		db[user] = {
			stage: 0,
			itens: [],
			midias: [],
			messageId: [],
			phone_num: [],
		}
		return db[user].stage
	}
}

exports.cliente = cliente
