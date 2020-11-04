/**
 * General functions
 * Author: Tiago Lobao
 * Year: 2020 (yes, during COVID-19)
 * 
 * ...
 * Rather sharing the code than 
 * overloading my server in case of hype,
 * so just give credits :)
 * ...
 */

const request = require('request');
const CONFIG = require('./config');
const Game = require('./game');

const TEXTS = require(`./languages/${CONFIG.LANGUAGE}`);

let Helpers = {
    
    /**
     * Check if the message should be handled
     * @param {Object} message - Discord message object
     * @returns {boolean}
     */
    isValidMessage(message)
    {
        if(
            message.author.bot ||
            ( CONFIG.PREFIX != null && !message.content.startsWith(CONFIG.PREFIX) )
        ){
            return false;
        } 
        else
        {
            return true;
        }
    },

    /**
     * Get The args given to the bot (OBS: message should be evaluated before!)
     * @param {Object} message - Discord message object
     * @returns {boolean}
     */
    getArgs(message)
    {
        return message.content.slice(CONFIG.PREFIX.length).split(' ').pop();
    },

    /**
     * Checks the content of the message for images. gifs, files, etc.
     * @param {Object} message 
     * @returns {boolean}
     */
    checkContainsImage(message)
    {
        return new Promise((resolve, reject) => {
            const gifID = message.content.match(/(?<=https:\/\/tenor.com\/view\/[a-zA-Z-]*)[0-9].*$/);
            if(
                message.attachments.size > 0 ||
                message.content.match(/\.(jpeg|jpg|gif|png)$/)
            )
            {
                // Then is a image/attachments
                resolve(true);
            }
            else if( gifID != null )
            {
                request.get({
                    url: `https://api.tenor.com/v1/gifs?ids=${gifID}&key=${CONFIG.TENOR_KEY}&media_filter=minimal&limit=1`
                }, (error, response, body) => {
                    if( error == null )
                    {
                        if( JSON.parse(body).results.length > 0 )
                        {
                            // Then the GIF is valid
                            resolve(true);
                        }
                    }
                    else
                    {
                        reject(`Bad Response from TENOR API => ${error}`);
                    }
                });
            }
            else
            {
                resolve(false);
            }
        });
    },

    /**
     * Randomly choose one text option
     * @param {Array} - List of Strings (messages) to be choosen
     * @returns {String}
     */
    chooseAmongMessages(messageList)
    {
        const messageIndex = Math.floor(Math.random() * messageList.length);
        return messageList[messageIndex];
    },

    /**
     * @param {}
     */
    chooseRandomWord()
    {
        return new Promise((resolve, reject)=>{
            request.get({
                url: 'https://api.dicionario-aberto.net/random'
            }, (error, response, body) => {
                if( error == null )
                {
                    resolve(body.word);
                }
                else{
                    reject('Error @ Dictionary API');
                }
            });
        });
    },

    /**
     * Generate message to announce the winner
     * @param {String} name
     * @param {Integer} votes 
     */
    generateWinnerMessage(name, votes)
    {
        return `${TEXTS.GAME_WINNER[0]} ${name} ${TEXTS.GAME_WINNER[1]} ${votes} ${TEXTS.GAME_WINNER[2]}`;
    },

    /**
     * Get the game accourding to the guild
     * @param {Integer} guildId - ID of the guild requested
     * @param {Array} game - Array with list of games
     * @returns {Object} Game instance
     */
    selectGuild(guildId, game)
    {
        let cnt;
        for ( cnt = 0; cnt < game.length; cnt++) {
            if( guildId === game[cnt].guildId )
            {
                return cnt;
            }
        }
        // If was not found, create new instance
        game.push(new Game(guildId));
        return cnt;
    }

}

module.exports = Helpers;