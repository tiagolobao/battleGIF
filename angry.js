
/**
 * Angry behavior functions
 * Author: Tiago Lobao
 * Year: 2020 (yes, during COVID-19)
 * 
 * ...
 * Rather sharing the code than 
 * overloading my server in case of hype,
 * so just give credits :)
 * ...
 */

const CONFIG = require('./config');
const Helpers = require('./helpers');

const TEXTS = require(`./languages/${CONFIG.LANGUAGE}`);

class Angry{

    constructor(){
        this.userList = []
    };

    // Constants for angry states
    STATES = {
        COOL: 0,
        ANGRY: 1,
        TRANSFORMING: 2,
    };

    /**
     * Add user to the list of strikes
     * @param {String} user 
     */
    addUser(lastMessage,user)
    {
        this.userList.push({
            state: this.STATES.COOL,
            name: user,
            wrongCount: 0,
            lastMessage: lastMessage
        });
    };

    /**
     * increment user list of wrong command and decides if should be angry or not
     * @param {String} user 
     */
    incrementUser(message, userName)
    {
        for (let i = 0; i < this.userList.length; i++)
        {
            if( this.userList[i].name == userName )
            {
                this.userList[i].wrongCount++; 
                if( this.userList[i].wrongCount > CONFIG.ANGRY_COUNT_LIMIT )
                {
                    this.userList[i].state = this.STATES.ANGRY;
                } 
                else if ( this.userList[i].wrongCount == CONFIG.ANGRY_COUNT_LIMIT )
                {
                    this.userList[i].state = this.STATES.TRANSFORMING;
                }
                else
                {
                    this.userList[i].state = this.STATES.COOL;
                }
                this.userList[i].lastMessage = message; 
                break;
            }
        }
        // Case user not found
        this.addUser(message,userName);
    };

    /**
     * returns the message for the specified user
     * @param {String} user 
     */
    getMessageForUser(message,userName)
    {
        let messageIndex = 0;
        this.incrementUser(message,userName);
        for (let i = 0; i < this.userList.length; i++)
        {
            const user = this.userList[i] 
            if(user.name == userName){
                switch(user.state){
                    case this.STATES.ANGRY:
                        return Helpers.chooseAmongMessages(TEXTS.MAD_MESSAGE_LIST);
                        break;
                    case this.STATES.COOL:
                        return Helpers.chooseAmongMessages(TEXTS.COOL_MESSAGE_LIST);
                        break;
                    case this.STATES.TRANSFORMING:
                        return chooseAmongMessages(TEXTS.TRANSFORMING_MESSAGE_LIST);
                        break;
                }
                break;
            }
        }
    };

};

module.exports = Angry;