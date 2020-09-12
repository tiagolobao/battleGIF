/************************************************
 * Init code for Discord BattleGIF BOT
 * Author: Tiago Lobao
 * Year: 2020 (yes, during COVID-19)
 * 
 * ...
 * Rather sharing the code than 
 * overloading my server in case of hype,
 * so just give credits :)
 * ...
 **********************************************/
// ------------------------------------------------------------------------------
// ------------------------- Load modules & configs -----------------------------
// ------------------------------------------------------------------------------
const Discord = require('discord.js');
const CONFIG = require('./config.json');
const Helpers = require('./helpers');
const Angry = require('./angry');

// ------------------------------------------------------------------------------
// ------------------------- Declare and init variables -------------------------
// ------------------------------------------------------------------------------
const client = new Discord.Client();
let gameState = Helpers.GAME_STATES.IDLE;
let angry = new Angry();

// ------------------------------------------------------------------------------
// ------------------------- Define bot reponse behavior ------------------------
// ------------------------------------------------------------------------------
client.on('message', m => {
    if( !Helpers.isValidMessage(m, CONFIG.PREFIX) ) return;

    if( CONFIG.ANGRY == true )
    {
        m.reply(angry.getMessageForUser(m,m.author.username));
    }
    else
    {
        m.reply('Sorry, command not found');
    }
    
});

client.on('messageReactionAdd', function(messageReaction, user){
    console.log(`a reaction is added to a message`);
});

// ------------------------------------------------------------------------------
// ------------------------- Define bot extra behavior --------------------------
// ------------------------------------------------------------------------------
client.on('ready', () => {
    console.log(`the client becomes ready to start`);
	console.log(`I am ready! Logged in as ${client.user.tag}!`);
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  	client.user.setActivity('Zoando o jogo da rapaziada');
	client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
	.then(link => {
		console.log(`Generated bot invite link: ${link}`);
		inviteLink = link;
    });
    
});

client.on('reconnecting', () => {
    console.log(`client tries to reconnect to the WebSocket`);
});

client.on('resume', (replayed) => {
    console.log(`whenever a WebSocket resumes, ${replayed} replays`);
});

client.on('warn', (info) => {
    console.log(`warn: ${info}`);
});

client.login(CONFIG.BOT_TOKEN);