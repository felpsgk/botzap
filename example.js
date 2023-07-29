const { query, jsdom, webscrap, fns, Client, Location, List, Buttons, LocalAuth } = require('./index');
const { buscaCI } = require('./webscrap');
const { JSDOM } = jsdom;
var priceStart;
var priceEnd;
var minOvr;
let DDD = '';
let MENSAGEM = '';
let PERSONALIZANDO = false;
var connection = fns.createCon();
//connection.connect();

function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: {
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: true
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message', async msg => {
    let chat = await msg.getChat();
    const contact = await msg.getContact();
    //só olha para mensagens que não são de grupo
    //if (!chat.isGroup) {
    //console.log('MESSAGE RECEIVED', msg);
    try {
        const result = await query.insertMassaDados(contact, connection);
    } catch (error) {
        console.error('Um erro ocorreu:', error);
    }
    /*async function inserirBanco(id, link) {
        await sleep(1000);
        inserido = await insert(id, link);
        pegaLink = await getLink(id);
    }
    async function updateBanco(id, link) {
        await sleep(1000);
        atualizado = await updateLink(id, link);
        pegaLink = await getLink(id);
    }
    async function insert(id, link) {
        await sleep(1000);
        var sql = "SELECT COUNT(*) AS count FROM usuarios WHERE id = ?";
        var value = [id];
        connection.query(sql, [value], function (err, result, fields) {
            if (result[0].count > 0) {
                console.log('maior q zero, sera update');

                var sql = "UPDATE usuarios SET link = '" + link + "' WHERE id = '" + id + "'";
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " atualizado");
                    return true;
                });

            } else {
                console.log('igual a zero, sera insert');
                var sql = "INSERT INTO usuarios (id, link) VALUES ?";
                var values = [
                    [id, link]
                ];
                connection.query(sql, [values], function (err, result) {
                    if (err) throw err;
                    console.log("Inserido: " + result.affectedRows);
                    return true;
                });
            }
            return true;
            //connection.end();
            //get(id);
        });
        return true;
    }
    async function getLink(id) {
        await sleep(1000);

        const results = sqlQuery(connection)
        function sqlQuery(dbConnection) {
            return new Promise((resolve, reject) => {
                dbConnection.query('SELECT link FROM usuarios WHERE id = ' + mysql.escape(id), function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        //Rejeita a promessa
                        reject(error)
                    }
                    //Conclui a promessa
                    resolve(results)
                    //dbConnection.end();
                })
            })
        }
        return results.then(
            function (r) {
                return r[0].link;
            }
        );
    }
    async function updateLink(id, newLink) {
        await sleep(1000);
        const results = sqlQuery(connection)
        function sqlQuery(dbConnection) {
            return new Promise((resolve, reject) => {
                dbConnection.query('SELECT link FROM usuarios WHERE id = ' + mysql.escape(id),
                    function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            //Rejeita a promessa
                            reject(error)
                        }
                        //Conclui a promessa
                        resolve(results)
                        //dbConnection.end();
                    })
            })
        }
        //console.log(' results promisse ' +results) // Promise
        return results.then(
            function (r) {
                var oldLink = r[0].link;
                oldLink += newLink;
                var sql = "UPDATE usuarios SET link = '" + oldLink + "' WHERE id = '" + id + "'";
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " atualizado");
                    return true;
                });
                return true;
            }

        );
        return true;
    }*/

    if (msg.body.toLowerCase().includes('bom dia')) {
        // Send a new message as a reply to the current one
        if (!chat.isGroup) {
            sleep(5000);
            const respostas = [
                'Bom diaa',
                'Opa, bom diaa',
                'Héee uai, bom diaa',
                'HHammm fiii bom dia kk',
                'Buenos el dias',
                'fala fi, bom dia dms',
                'opa! suave?',
                'Bom dia, deboa?'
            ];
            // Escolha aleatória da resposta
            const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
            msg.reply(respostaAleatoria);
        }

    } else if (msg.body.toLowerCase().includes('bom dia amor')) {
        // Send a new message as a reply to the current one
        if (!chat.isGroup) {
            msg.reply('Bom dia meu Amor 😘😍');
        }

    } else if (msg.body.toLowerCase().includes('bom dia meu amor')) {
        // Send a new message as a reply to the current one
        if (!chat.isGroup) {
            msg.reply('Bom dia 😘 amorzim 😍');
        }

    } else if (msg.body.toLowerCase() === 'piada') {
        console.log("mensagem de piada");
        // Send a new message as a reply to the current one
        const piadoca = await query.selectPiada(connection)
        if (!chat.isGroup) {
            //const piadas = [];
            msg.reply("Lá vai! " + piadoca);
        }

    } else if (msg.body.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === 'classificacao meu time') {
        // Send a new message to the same chat
        if (!chat.isGroup) {
            const teamNames = await webscrap.listaTimeBrasileirao();
            // Criar um array de linhas (rows) com os nomes dos times
            client.sendMessage(msg.from, "encaminhe de volta o nome do seu time");
            teamNames.forEach((teamName) => {
                if (teamName.length === 0) {
                } else {
                    client.sendMessage(msg.from, "meu time é " + teamName);
                    sleep(2234);
                }
                // Add your custom logic here for processing each team name
            });
        }
    } else if (msg.body.toLowerCase().startsWith('meu time é ')) {
        // Direct send a new message to specific id
        const teamNames = await webscrap.timeBrasileirao(msg.body.substring(11));
        msg.reply(teamNames);

    } else if (msg.body.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith('tabela serie a')) {
        // Direct send a new message to specific id
        msg.reply("```" + await webscrap.montarTabela(await webscrap.getTabela('bra')) + "```");

    } else if (msg.body.toLowerCase() === 'loja do tony') {
        // Send a new message as a reply to the current one
        if (!chat.isGroup) {
            //const piadas = [];
            msg.reply("Bem vindo a loja do tony!");
            client.sendMessage(msg.from, "Como podemos te atender hoje?");
            client.sendMessage(msg.from, "Temos os mais diversos produtos");
            client.sendMessage(msg.from, "🥬Verduras");
            client.sendMessage(msg.from, "🍅Legumes e frutas");
            client.sendMessage(msg.from, "🥚Ovos");
            client.sendMessage(msg.from, "🥓Frios🧈");
            client.sendMessage(msg.from, "Faça sua lista e pague via pix e separamos tudo pra você!");
        }

    }
    else if (msg.body.startsWith('!buscaCI ')) {
        var ci = msg.body.slice(9);
        console.log("TESTE MSG CI "+ci)
        var linkci = await buscaCI(ci);
        msg.reply(linkci);

    } else if (msg.body.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .includes('cardapio')) {
        sendMenu(msg);
    } else if (msg.body === '1') {
        msg.reply('Ótima escolha! 🍔\nNosso hambúrger vem com:');
        client.sendMessage(msg.from, 'Alface 🥬');
        client.sendMessage(msg.from, 'Tomate 🍅');
        client.sendMessage(msg.from, 'Carne de hambúrger 🥩');
        client.sendMessage(msg.from, 'Queijo 🧀');
        client.sendMessage(msg.from, 'Qual seu endereço?');
    } else if (msg.body === '2') {
        msg.reply('Excelente! 🍔\nNossa batata vem com:');
        client.sendMessage(msg.from, 'Batata');
        client.sendMessage(msg.from, 'Bacon 🥩');
        client.sendMessage(msg.from, 'Cheddar 🧀');
        client.sendMessage(msg.from, 'Qual seu endereço?');
    } else if (msg.body === '3') {
        client.sendMessage(msg.from, 'Ótima escolha! 🥤');
        msg.reply('Joia! 🍔\nVamos te enviar uma Coca-cola geladinha!');
        client.sendMessage(msg.from, 'Caso queira outro sabor, especifique após informar o endereço');
    } else if (msg.body.toLowerCase().startsWith('rua')) {
        // Opção 5: Voltar ao menu anterior
        msg.reply('Vamos entregar neste local: ' + msg.body);
        client.sendMessage(msg.from, 'Qualquer observação, envie agora!');
    } else if (msg.body.toLowerCase().includes('voltar')) {
        client.sendMessage(msg.from, 'Voltando ao menu anterior...');
        sendMenu(msg);
    }

    else if (msg.body.startsWith('!subject ')) {
        // Change the group subject
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newSubject = msg.body.slice(9);
            chat.setSubject(newSubject);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!echo ')) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
    } else if (msg.body.startsWith('!desc ')) {
        // Change the group description
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newDescription = msg.body.slice(6);
            chat.setDescription(newDescription);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!leave') {
        // Leave the group
        let chat = await msg.getChat();
        if (chat.isGroup) {
            chat.leave();
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!join ')) {
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Joined the group!');
        } catch (e) {
            msg.reply('That invite code seems to be invalid.');
        }
    } else if (msg.body === '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!chats') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } else if (msg.body === '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
    } else if (msg.body === '!mediainfo' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
    } else if (msg.body === '!quoteinfo' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
    } else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!location') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } else if (msg.location) {
        msg.reply(msg.location);
    } else if (msg.body.startsWith('!status ')) {
        const newStatus = msg.body.split(' ')[1];
        await client.setStatus(newStatus);
        msg.reply(`Status was updated to *${newStatus}*`);
    } else if (msg.body === '!mention') {
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        chat.sendMessage(`Hi @${contact.number}!`, {
            mentions: [contact]
        });
    } else if (msg.body === '!delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    } else if (msg.body === '!pin') {
        const chat = await msg.getChat();
        await chat.pin();
    } else if (msg.body === '!archive') {
        const chat = await msg.getChat();
        await chat.archive();
    } else if (msg.body === '!mute') {
        const chat = await msg.getChat();
        // mute the chat for 20 seconds
        const unmuteDate = new Date();
        unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
        await chat.mute(unmuteDate);
    } else if (msg.body === '!typing') {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
    } else if (msg.body === '!recording') {
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
    } else if (msg.body === '!clearstate') {
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
    } else if (msg.body === '!jumpto') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            client.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
    } else if (msg.body === '!buttons') {
        let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');
        client.sendMessage(msg.from, button);
    } else if (msg.body === '!list') {
        let sections = [{ title: 'sectionTitle', rows: [{ title: 'ListItem1', description: 'desc' }, { title: 'ListItem2' }] }];
        let list = new List('List body', 'btnText', sections, 'Title', 'footer');
        client.sendMessage(msg.from, list);
    } else if (msg.body === '!reaction') {
        msg.react('👍');
    } else if (msg.body === '!edit') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.edit(msg.body.replace('!edit', ''));
            } else {
                msg.reply('I can only edit my own messages');
            }
        }
    } else if (msg.body === '!updatelabels') {
        const chat = await msg.getChat();
        await chat.changeLabels([0, 1]);
    } else if (msg.body === '!addlabels') {
        const chat = await msg.getChat();
        let labels = (await chat.getLabels()).map(l => l.id);
        labels.push('0');
        labels.push('1');
        await chat.changeLabels(labels);
    } else if (msg.body === '!removelabels') {
        const chat = await msg.getChat();
        await chat.changeLabels([]);
    }
    //}
});

function sendMenu(msg) {
    client.sendMessage(msg.from, 'Aqui está o nosso cardápio:');
    client.sendMessage(msg.from, '*1.* 🍔 Hambúrguer');
    client.sendMessage(msg.from, '*2.* 🍟 Batata Frita');
    client.sendMessage(msg.from, '*3.* 🥤 Refrigerante');
    client.sendMessage(msg.from, 'Para fazer um pedido, digite o número da opção desejada.\nA qualquer momento, digite \'*voltar*\'');

}

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if (ack == 3) {
        // The message was read
    }
});
/*
client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});*/

client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});

// Change to false if you don't want to reject incoming calls
let rejectCalls = true;
/*
client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
    await client.sendMessage(call.from, `[${call.fromMe ? 'Outgoing' : 'Incoming'}] Phone call from ${call.from}, type ${call.isGroup ? 'group' : ''} ${call.isVideo ? 'video' : 'audio'} call. ${rejectCalls ? 'This call was automatically rejected by the script.' : ''}`);
});*/

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.on('contact_changed', async (message, oldId, newId, isContact) => {
    /** The time the event occurred. */
    const eventTime = (new Date(message.timestamp * 1000)).toLocaleString();

    console.log(
        `The contact ${oldId.slice(0, -5)}` +
        `${!isContact ? ' that participates in group ' +
            `${(await client.getChatById(message.to ?? message.from)).name} ` : ' '}` +
        `changed their phone number\nat ${eventTime}.\n` +
        `Their new phone number is ${newId.slice(0, -5)}.\n`);

    /**
     * Information about the {@name message}:
     * 
     * 1. If a notification was emitted due to a group participant changing their phone number:
     * {@name message.author} is a participant's id before the change.
     * {@name message.recipients[0]} is a participant's id after the change (a new one).
     * 
     * 1.1 If the contact who changed their number WAS in the current user's contact list at the time of the change:
     * {@name message.to} is a group chat id the event was emitted in.
     * {@name message.from} is a current user's id that got an notification message in the group.
     * Also the {@name message.fromMe} is TRUE.
     * 
     * 1.2 Otherwise:
     * {@name message.from} is a group chat id the event was emitted in.
     * {@name message.to} is @type {undefined}.
     * Also {@name message.fromMe} is FALSE.
     * 
     * 2. If a notification was emitted due to a contact changing their phone number:
     * {@name message.templateParams} is an array of two user's ids:
     * the old (before the change) and a new one, stored in alphabetical order.
     * {@name message.from} is a current user's id that has a chat with a user,
     * whos phone number was changed.
     * {@name message.to} is a user's id (after the change), the current user has a chat with.
     */
});

client.on('group_admin_changed', (notification) => {
    if (notification.type === 'promote') {
        /** 
          * Emitted when a current user is promoted to an admin.
          * {@link notification.author} is a user who performs the action of promoting/demoting the current user.
          */
        console.log(`You were promoted by ${notification.author}`);
    } else if (notification.type === 'demote')
        /** Emitted when a current user is demoted to a regular user. */
        console.log(`You were demoted by ${notification.author}`);
});
