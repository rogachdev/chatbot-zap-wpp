const session = require('../index')
const db = require('../db')

async function execute(message) {
	session.cliente
		.then(async (client) => {
			if (message.isGroupMsg === false) {
				var telefone = (db[message.from].phone_num = message.from.split('@')[0])
				if (db[message.from].phone_num.length == 12) {
					db[message.from].phone_num = String(`${message.from}`)
						.split('@')[0]
						.substr(3)
					db[message.from].phone_num = String(`${message.from}`)
				}
				const contact = await client
					.getContact(message.from)
					.then((result) => {
						return result.pushname || result.verifiedName || ''
					})
					.catch((error) => {
						console.log(error)
					})

				db[message.from].itens[0] = {
					...db[message.from].itens[0],
					numero_pedido: Math.floor(Math.random() * 02451),
				}
				db[message.from].itens[0] = {
					...db[message.from].itens[0],
					nome_client: contact,
				}
				db[message.from].itens[0] = {
					...db[message.from].itens[0],
					whatsapp_client: telefone,
				}
				db[message.from].stage = 1

				console.log('Estagio' + db[message.from].stage)
				console.log(db[message.from].itens)

				await client
					.sendImage(
						message.from,
						'src/img/principal.jpg',
						'principal.jpg',
						`_Bem vindo(a)_ *${contact}* a *A Saborosa Pizza*. Abaixo segue um pequeno menu de opções, onde você pode escolher um *número*. \n` +
							`--------------------------------------------- \n` +
							`1️⃣ - 🍕 Fazer pedido.  \n` +
							`2️⃣ - 📍 Minha Lista. \n` +
							`4️⃣ - 😋 Nossas Promoções. \n` +
							`5️⃣ - 👩🏻‍🦰 Asistente humano. \n` +
							`--------------------------------------------- \n` +
							`*️⃣ - *Para sair*\n`
					)
					.then((result) => {})
					.catch((error) => {
						console.log(error)
					})
			}
		})
		.catch((error) => {
			console.log(error)
		})
}
exports.execute = execute
