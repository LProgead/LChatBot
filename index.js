const Discord = require('discord.js');
const client = new Discord.Client({ fetchAllMembers: true });
const mysql = require('mysql');
require('dotenv').config();

client.login(process.env.token);

client.on('ready', () => {
    console.log(`[DEMARRAGE] Lancé sur ${client.guilds.cache.size} serveurs avec ${client.users.cache.size} utilisateurs.`);

    setInterval(() => {
        client.user.setActivity(`discuter avec ${client.users.cache.size} utilisateurs sur ${client.guilds.cache.size} serveurs !`);
    }, 60000);
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.db_id,
    password: process.env.db_mdp,
    database: 'lchatbot'
});

connection.connect();

client.on('message', message => {
    if (message.author.bot) return;

    if (!message.guild) {
        if (message.content.toLowerCase() === "ne m'enregistrez pas") {
            connection.query(`INSERT INTO record (ID, discord) VALUES (NULL, '${message.author.id}')`);

            const saved = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('Vos préférences ont bien été enregistrées !')
                .setFooter('LChatBot, un bot signé LProgead.', client.user.displayAvatarURL())
                .setTimestamp()

            return message.channel.send(saved);
        }

        let answerd = 0;

        connection.query(`SELECT * FROM answers`, function (error, results, fields) {
            results.forEach(() => {
                if (answerd != 1) {
                    answerd = 1;
                    connection.query(`SELECT * FROM answers WHERE refer_to='${message.content.toLocaleLowerCase().replace("'", "\\'")}'`, function (error, results2, fields) {
                        if (!results2 || !results2[0]) {
                            const unknown = new Discord.MessageEmbed()
                                .setAuthor(message.author.username, message.author.displayAvatarURL())
                                .setDescription('Je ne sais que répondre...')
                                .setFooter('LChatBot, un bot signé LProgead.', client.user.displayAvatarURL())
                                .setTimestamp()

                            message.channel.send(unknown);

                            const dkembed = new Discord.MessageEmbed()
                                .setAuthor('Phrase inconnue')
                                .setColor('FF2200')
                                .setDescription(`L'utilisateur ${message.author.tag} (${message.author.id}) vient de me dire quelque chose d'inconnu : \n\`\`\`${message.content}\`\`\``)
                                .setFooter('LChatBot, un bot signé LProgead.', client.user.displayAvatarURL())
                                .setTimestamp()

                            return client.channels.cache.get('743017774942650390').send(dkembed);
                        }

                        let tosend = results2[Math.floor(Math.random() * Math.floor(results2.length))]['content'];

                        tosend = tosend.charAt(0).toUpperCase() + tosend.slice(1);

                        const answer = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setDescription(tosend)
                            .setFooter('LChatBot, un bot signé LProgead.', client.user.displayAvatarURL())
                            .setTimestamp()

                        message.channel.send(answer);
                    });
                }
            });
        });
    } else {
        connection.query(`SELECT * FROM known_users WHERE discord = '${message.author.id}'`, function (error, results, fields) {
            if (!results || !results[0]) {
                const unknown_user = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('Enchanté, je suis LChatBot !')
                    .setDescription('Laissez-moi me présenter, je suis un chatbot qui apprend grâce aux messages envoyés sur les serveurs où je suis présent. \nÉtant donné que j\'enregistre tous les messages que je rencontre, je me dois bien de vous prévenir que vous pouvez refuser cette collecte de vos messages en envoyant, ici même, le message suivant : `Ne m\'enregistrez pas`. \n**Si vous ne vous opposez pas à cette collecte, merci de ne __PAS__ répondre à ce message.** \nDans un soucis de confidentialité, notre équipe ne sera, bien sûr, pas informé que vous avez refusé cette collecte. \n*Notez bien que cela ne vous empêche pas d\'utiliser le service ^^*')
                    .setFooter('LChatBot, un bot signé LProgead.', client.user.displayAvatarURL())
                    .setTimestamp()

                message.author.send(unknown_user)
                    .catch(() => {
                        message.channel.send(unknown_user);
                    });

                return connection.query(`INSERT INTO known_users (ID, discord) VALUES (NULL, '${message.author.id}')`);
            }

            connection.query(`SELECT * FROM record WHERE discord = '${message.author.id}'`, function (error, results1, fields) {
                if (!results1 || !results1[0]) {
                    const collector = new Discord.MessageCollector(message.channel, m => m.author.id != message.author.id, { max: 1 });
                    collector.on('collect', answer => {
                        connection.query(`SELECT * FROM record WHERE discord = '${answer.author.id}'`, function (error, results1, fields) {
                            if (!results1 || !results1[0]) {
                                if (answer.author.bot) return;

                                connection.query(`SELECT * FROM sentences WHERE content = '${answer.content.toLocaleLowerCase().replace("'", "\\'")}'`, function (error, results2, fields) {
                                    if (!results2 || !results2[0]) {
                                        connection.query(`INSERT INTO answers (ID, content, refer_to) VALUES (NULL, '${answer.content.toLocaleLowerCase()}', '${message.content.toLocaleLowerCase()}')`);
                                        const addembed = new Discord.MessageEmbed()
                                            .setAuthor('Phrase ajoutée')
                                            .setColor('FAFAFA')
                                            .setDescription(`L'utilisateur ${answer.author.tag} (${answer.author.id}) m'a permis d'ajouter une nouvelle réponse à **${message.content.toLocaleLowerCase()}** grâce à son message : \n\`\`\`${answer.content}\`\`\``)
                                            .setFooter('LChatBot, un bot signé LProgead.', client.user.displayAvatarURL())
                                            .setTimestamp()

                                        client.channels.cache.get('743054216368750602').send(addembed);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    }
});
