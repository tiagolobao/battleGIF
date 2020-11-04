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
const CONFIG = require('./config');
const Helpers = require('./helpers');
const Angry = require('./angry');
const Game = require('./game');

const TEXTS = require(`./languages/${CONFIG.LANGUAGE}`);

// ------------------------------------------------------------------------------
// ------------------------- Declare and init variables -------------------------
// ------------------------------------------------------------------------------
const client = new Discord.Client();
let angry = new Angry();
let game = [];

// ------------------------------------------------------------------------------
// ------------------------- Define bot reponse behavior ------------------------
// ------------------------------------------------------------------------------
client.on('message', m => {

    let guild = Helpers.selectGuild(m.channel.guild.id, game);
    /**
     * ------ BOT WAITING TO START A ROUND ------ 
        * - Answer unknown commands
        * - 'start "theme"' command => Runs the game with the selected theme
        * */
    if( !game[guild].isRunning() )
    {
        if( Helpers.isValidMessage(m) ){
            const args = Helpers.getArgs(m);
            if (args === 'start')
            {
                m.reply(Helpers.chooseAmongMessages(TEXTS.GAME_START_MESSAGE));
                game[guild].run(m.channel, "noTheme");
            }
            else if(args === 'help')
            {
                m.reply(TEXTS.HELP_MESSAGE);
            }
            else
            {
                m.reply( CONFIG.ANGRY ? angry.getMessageForUser(m,m.author.username) : Helpers.chooseAmongMessages(TEXTS.COMMAND_NOT_FOUND_MESSAGE) );
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
                m.reply(Helpers.chooseAmongMessages(TEXTS.GAME_STOP_MESSAGE));
                game[guild].stop();
            }
            else if(args === 'help')
            {
                m.reply(TEXTS.HELP_MESSAGE);
            }
            else
            {
                m.reply(Helpers.chooseAmongMessages(TEXTS.GAME_IS_RUNNING));
            }
        }
        else
        {
            // If was in the right channel
            if(game[guild].isGameChannel(m.channel.id))
            {
                // If a image was sent
                Helpers.checkContainsImage(m)
                .then(isValid => {
                    if(isValid)
                    {
                        let addWasSucceed;
                        addWasSucceed = game[guild].addCompetitor(
                            m.author.username,
                            m.author.id,
                            m.id
                        );
                        if( !addWasSucceed )
                        {
                            m.reply(Helpers.chooseAmongMessages(TEXTS.TWICE_COMPETITOR_FOUND));
                        }
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
    let guild = Helpers.selectGuild(m.channel.guild.id, game);
    if( game[guild].isRunning() )
    {
        game[guild].addVotePointIfCompeting(reaction.message.id);
        if( game[guild].canFinish(0) )
        {
            let winner = game[guild].getWinner();
            game[guild].channel.send(Helpers.generateWinnerMessage(winner.name,winner.votes));
            game[guild].stop();
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

  	client.user.setActivity(Helpers.chooseAmongMessages(TEXTS.BOT_ACTIVITY));
	client.generateInvite(['SEND_MESSAGES', 'MENTION_EVERYONE', 'ADD_REACTIONS', 'MANAGE_MESSAGES'])
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