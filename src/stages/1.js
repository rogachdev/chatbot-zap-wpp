const db = require('../db')
const session = require('../index')

async function execute(message) {
	session.cliente.then(async (client) => {
		if (message.body === '1') {
			db[message.from].stage = 2
			console.log('Estagio ' + db[message.from].stage)
			console.log(db[message.from].itens)

			await client.sendFile(message.from, 'src/img/pizza-1.jpg', {
				useTemplateButtons: true, // False for legacy
				buttons: [
					{
						id: 'your custom id 1',
						text: 'Cardápio',
					},
					{
						id: 'another id 2',
						text: 'Another text',
					},
				],
				title: '*Pizzaria Dois Sabores*', // Optional
				footer: 'Rua: Adelino barros, 12 - Bom Sucesso.', // Optional
			})
			return
		}

		if (message.body === '2') {
			db[message.from].stage = 2
			console.log('Estagio ' + db[message.from].stage)
			console.log(db[message.from].itens)

			await client.sendListMessage(message.from, {
				buttonText: 'Click here',
				description: 'Choose one option',
				sections: [
					{
						title: 'Section 1',
						rows: [
							{
								rowId: 'my_custom_id',
								title: 'stage 1',
								description: 'vai para o stage 2',
							},
							{
								rowId: '2',
								title: 'Test 2',
								description: 'Description 2',
							},
						],
					},
				],
			})
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
