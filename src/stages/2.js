const db = require('../db')
const session = require('../index')

async function execute(message) {
	session.cliente.then(async (client) => {
		if (message.body === 'Cardápio') {
			db[message.from].stage = 3
			console.log('Estagio ' + db[message.from].stage)
			console.log(db[message.from].itens)

			await client.sendImage(
				message.from,
				'src/img/pizza-1.jpg',
				'pizza-1.jpg',
				'*=== PIZZAS TRADICIONAIS ===*\n' +
					'🍕 _PEQUENA: *R$: 28,00* 🍕 MEDIA: *R$: 38,00* 🍕 GRANDE: *R$: 48,00*_\n\n' +
					'*[1] CALABRESA*\n' +
					'Salsa, mossarella, calabreza, cebolla, azeituna y orégano.\n\n' +
					'*[2] PEPERONI*\n' +
					'Salsa, mossarella, pepperoni, azeituna y orégano.\n\n' +
					'*[3] CUATRO QUESO*\n' +
					'Salsa, mossarella, provolone, cheddar, requeson, azeituna y orégano.\n\n' +
					'*[4] AMERICANA*\n' +
					'Salsa, mossarella, jamon, champiñones, azeituna y orégano.\n'
			)
			return
		}

		if (message.body.toLowerCase() === 'voltar') {
			const contact = await client
				.getContact(message.from)
				.then((result) => {
					return result.pushname || result.verifiedName || ''
				})
				.catch((error) => {
					console.log(error)
				})

			db[message.from].stage = 1
			for (let i in db[message.from].itens[0]) {
				delete db[message.from].itens[0][i]
			}
			console.log('Estagio ' + db[message.from].stage)
			console.log(db[message.from].itens)

			await client.sendImage(
				message.from,
				'src/img/principal.jpg',
				'principal.jpg',
				`_Bem vindo(a) de volta_ *${contact}* a *A Saborosa Pizza*. Abaixo segue um pequeno menu de opções, onde você pode escolher um *número*. \n` +
					`--------------------------------------------- \n` +
					`1️⃣ - 🍕 Fazer pedido.  \n` +
					`2️⃣ - 📍 Minha Lista. \n` +
					`4️⃣ - 😋 Nossas Promoções. \n` +
					`5️⃣ - 👩🏻‍🦰 Asistente humano. \n` +
					`--------------------------------------------- \n` +
					`*️⃣ - *Para sair*\n`
			)
			return
		}

		if (message.body === '#') {
			db[message.from].stage = 0
			for (let i in db[message.from].itens[0]) {
				delete db[message.from].itens[0][i]
			}
			console.log('Estagio ' + db[message.from].stage)
			console.log(db[message.from].itens)

			await client.sendText(message.from, '😒 Atendimento encerrado! \n')
			return
		} else {
			await client.sendText(message.from, '❌ Opção inválida, tente novamente.')
		}
	})
}

exports.execute = execute
