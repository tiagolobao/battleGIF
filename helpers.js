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
const CONFIG = require('./config.json');

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
     * Check if a url is a valid gif from TENOR.COM
     * @param {String} url - Url to the tenor gif
     * @returns {boolean}
     */
    isValidTenorGif(url)
    {
        let isValid = false;
        const gifID = url.match(/(?<=https:\/\/tenor.com\/view\/[a-zA-Z-]*)[0-9].*$/);
        if( gifID != null )
        {
            request.get({
                url: `https://api.tenor.com/v1/gifs?ids=${gifID}&key=${CONFIG.TENOR_KEY}&media_filter=minimal&limit=1`
            }, (error, response, body) => {
                if( error != null )
                {
                    if( body.results.length > 0 )
                    {
                        // Then the GIF is valid
                        isValid = true;
                    }
                }
                else
                {
                    console.warning('Bad response from TENOR API');
                    console.warning(error);
                }
            });
        }
        return isValid;
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
    }

}

module.exports = Helpers;