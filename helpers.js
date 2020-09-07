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