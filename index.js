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
const Game = require('./game');

// ------------------------------------------------------------------------------
// ------------------------- Declare and init variables -------------------------
// ------------------------------------------------------------------------------
const client = new Discord.Client();
let game = new Game();
let angry = new Angry();

// ------------------------------------------------------------------------------
// ------------------------- Define bot reponse behavior ------------------------
// ------------------------------------------------------------------------------
client.on('message', m => {
    /**
     * ------ BOT WAITING TO START A ROUND ------ 
        * - Answer unknown commands
        * - 'start "theme"' command => Runs the game with the selected theme
        * */
    if( !game.isRunning() )
    {
        if( Helpers.isValidMessage(m) ){
            const args = Helpers.getArgs(m);
            if (args === 'start')
            {
                m.reply(CONFIG.GAME_START_MESSAGE);
                game.run(m.channel, "noTheme");
            }    
            else
            {
                m.reply( CONFIG.ANGRY ? angry.getMessageForUser(m,m.author.username) : CONFIG.COMMAND_NOT_FOUND_MESSAGE );
            }
        }
    }
    /**
     * ------ BOT RUNNING A ROUND ------ 
     * - Answer unknown commands
     * - 'stop' command => Force finishing the round
     * - Listen images/GIF for the battle
     * */
    else
    {
        if( Helpers.isValidMessage(m) )
        {
            const args = Helpers.getArgs(m);
            if (args === 'stop')
            {
                m.reply(CONFIG.GAME_STOP_MESSAGE);
                game.stop();
            }
        }
        else
        {
            // If was in the right channel
            if(game.isGameChannel(m.channel.id))
            {
                // If a image was sent
                Helpers.checkContainsImage(m)
                .then(isValid => {
                    if(isValid){
                        let addWasSucceed;
                        addWasSucceed = game.addCompetitor(
                            m.author.username,
                            m.author.id,
                            m.id
                        );
                        if( !addWasSucceed )
                            m.reply(CONFIG.TWICE_COMPETITOR_FOUND);
                    }
                })
                .catch( 
                    error => console.error(error)
                );
            }
        }
    }
});

// Votes increments
client.on('messageReactionAdd', function(reaction, user)
{
    if( game.isRunning() )
    {
        game.addVotePointIfCompeting(reaction.message.id);
        if( game.canFinish(0) )
        {
            let winner = game.getWinner();
            game.channel.send(`O mizeravi que ganhou foi ${winner.name} com ${winner.votes} votos!!`);
            game.stop();
        }
    }
});

// ------------------------------------------------------------------------------
// ------------------------- Define bot extra behavior --------------------------
// ------------------------------------------------------------------------------
client.on('ready', () => {
    console.log(`the client becomes ready to start`);
	console.log(`I am ready! Logged in as ${client.user.tag}!`);
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  	client.user.setActivity(CONFIG.BOT_ACTIVITY);
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