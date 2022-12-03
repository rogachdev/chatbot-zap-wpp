const db = require('../db')
const session = require('../index')

async function execute(message) {
	session.cliente.then(async (client) => {
		if (message.body === '1') {
			db[message.from].stage = 3
			console.log('Estagio ' + db[message.from].stage)
			console.log(db[message.from].itens)

			await client.sendText(
				message.from,
				'*PIZZA DE CALABRESA*\n' +
					'🍕 _PEQUENA: *R$: 28,00* 🍕 MEDIA: *R$: 38,00* 🍕 GRANDE: *R$: 48,00*_\n\n' +
					'Para retornar ao _estagio anterior_ digite *Voltar*.'
			)
			return
		}
		// voltar ao stage anterior
		if (message.body.toLowerCase() === 'voltar') {
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
			await client.sendText(message.from, '--- 0 ---')
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
