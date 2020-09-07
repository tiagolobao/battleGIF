/**
 * Init code for Discord BattleGIF BOT
 * Author: Tiago Lobao
 * Year: 2020 (yes, during COVID-19)
 * 
 * ...
 * Rather sharing the code than 
 * overloading my server in case of hype,
 * so just give credits :)
 * ...
 */

console.log('starting bot client');

const Discord = require('discord.js');
const CONFIG = require('./config.json');
const Helpers = require('./helpers');

const client = new Discord.Client();

client.on('message', m => {
    if( !Helpers.isValidMessage(m, CONFIG.PREFIX) ) return;
    m.reply('Wait dude! I\'m still not working properly!');
});

client.login(CONFIG.BOT_TOKEN);
