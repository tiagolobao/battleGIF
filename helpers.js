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

let Helpers = {

    // Constants for states
    GAME_STATES: {
        IDLE: 0,
        RUNNING: 1,
    },
    
    /**
     * Check if the message should be handled
     * @param {Object} message - Discord message object
     * @param {String} prefix - Obrigatory first charaters of the message string to check 
     * @returns {boolean}
     */
    isValidMessage(message,prefix){
        if(
            message.author.bot ||
            ( prefix != null && !message.content.startsWith(prefix) )
        ){
            return false;
        } 
        else
        {
            return true
        }
    },

}

module.exports = Helpers;