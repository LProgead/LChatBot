const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql');
require('dotenv').config();

client.login(process.env.token);

client.on('ready', () => {
    console.log(`[DEMARRAGE] Lancé sur ${client.guilds.cache.size} serveurs avec ${client.users.cache.size} utilisateurs.`)
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
        let answerd = 0;

        connection.query(`SELECT * FROM answers`, function(error, results, fields) {
            results.forEach(() => {
                if (answerd != 1) {
                        
                    answerd = 1;
                    connection.query(`SELECT * FROM answers WHERE refer_to='${message.content.toLocaleLowerCase()}'`, function(error, results2, fields) {
                        if (!results2 || !results2[0]) {
                            message.channel.send('Je ne sais que répondre...');
                
                            const dkembed = new Discord.MessageEmbed()
                                .setAuthor('Phrase non connue')
                                .setColor('FF2200')
                                .setDescription(`L'utilisateur ${message.author.tag} (${message.author.id}) vient de me dire quelque chose d'inconnu : \n\`\`\`${message.content}\`\`\``)
                                .setTimestamp()
                
                            return client.channels.cache.get('743017774942650390').send(dkembed);
                        }

                        let tosend = results2[Math.floor(Math.random() * Math.floor(results2.length))]['content'];

                        tosend = tosend.charAt(0).toUpperCase() + tosend.slice(1);

                        message.channel.send(tosend);
                    });
                }
            });
        });
    } else {
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id != message.author.id, { max: 1 });
        collector.on('collect', answer => {
            connection.query(`SELECT * FROM sentences WHERE content = '${answer.content.toLocaleLowerCase()}'`, function(error, results1, fields) {
                if (!results1 || !results1[0]) {
                    connection.query(`INSERT INTO answers (ID, content, refer_to) VALUES (NULL, '${answer.content.toLocaleLowerCase()}', '${message.content.toLocaleLowerCase()}')`);
                    const addembed = new Discord.MessageEmbed()
                        .setAuthor('Phrase ajoutée')
                        .setColor('FAFAFA')
                        .setDescription(`L'utilisateur ${message.author.tag} (${message.author.id}) m'a permis d'ajouter une nouvelle réponse à **${message.content.toLocaleLowerCase()}** grâce à son message : \n\`\`\`${answer.content}\`\`\``)
                        .setTimestamp()

                    client.channels.cache.get('743054216368750602').send(addembed);
                }
            });
        });
    }
});