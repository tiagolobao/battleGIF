
/**
 * Game management functions
 * Author: Tiago Lobao
 * Year: 2020 (yes, during COVID-19)
 * 
 * ...
 * Rather sharing the code than 
 * overloading my server in case of hype,
 * so just give credits :)
 * ...
 */

class Game{

    // Constants for states
    GAME_STATES = {
        IDLE: 0,
        RUNNING: 1,
    }

    /**
     * @constructor
     * No arguments. There is only one initial state for the game
     */
    constructor()
    {
        this.state = this.GAME_STATES.IDLE, // If game is running or not
        this.channel = null, // From where the game was started
        this.theme = null, // Theme of the running round
        this.competitors = [] // List of competitors
        this.numOfVotes = 0 // Number of votes in the round
    }

    /**
     * @method
     * @returns {boolean} - the state of the game
     *
     */
    isRunning()
    {
        return ( this.state == this.GAME_STATES.RUNNING ? true : false );
    }

    /**
     * Starts a game
     * @method
     * @param {Object} - Channel to run the game
     * @param {String} - Theme of the round
     */
    run(channel, theme)
    {
        this.state = this.GAME_STATES.RUNNING;
        this.channel = channel;
        this.theme = theme;
    }

    /**
     * Ends a game
     * @method
     * @param {Object} - Channel to run the game
     * @param {String} - Theme of the round
     */
    stop()
    {
        this.state = this.GAME_STATES.IDLE;
        this.channel = null;
        this.theme = null;
        this.competitors = [];
    }

    /**
     * Checks the if the incomming channel message is from the game
     * @method
     * @param {Integer} - channel ID 
     * @returns {Boolean}
     */
    isGameChannel(channelID)
    {
        return ( channelID == this.channel.id ? true : false );
    }

    /**
     * Add a new competitor, if already does not exists
     * @method
     * @param {String} - name of the competitor
     * @param {Integer} - ID of the competitor
     * @param {Integer} - ID of the message to compete
     * @returns {boolean} - If the user was added successfully
     */
    addCompetitor(username, userID, messageID)
    {
        for (let competitorIndex = 0; competitorIndex < this.competitors.length; competitorIndex++)
        {
            if( userID == this.competitors[competitorIndex].id ){
                return false;
            }
        }
        this.competitors.push({
            name:    username,
            id:      userID,
            message: messageID,
            votes: 0
        });
        return true;
    }

    /**
     * Add +1 to votes count when is a gif inside the competition
     * @param {*} messageID 
     */
    addVotePointIfCompeting(messageID)
    {
        for (let competitorIndex = 0; competitorIndex < this.competitors.length; competitorIndex++)
        {
            if( messageID == this.competitors[competitorIndex].message ){
                this.competitors[competitorIndex].votes += 1;
                this.numOfVotes += 1;
            }
        }
    }

    /**
     * Checks if the game can finish. it means, if compatitors are more than 2 and everyone has reacted
     * @param {Integer} - If number of players were fixed
     * @returns {Boolean}
     */
    canFinish(numOfPlayers)
    {
        let finishable = false;
        if( 
            this.competitors.length > 1 &&
            this.competitors.length == this.numOfVotes
        )
        {
            finishable = true;
        }
        return finishable;
    }

    /**
     * Search for the most voted competitor
     * @returns {Object} - Winner info{
     *      username,
     *      numberOfVotes,
     * }
     */
    getWinner()
    {
        let winner = {
            name: 'none',
            id: 0,
            message: null,
            votes: 0
        };
        for (let competitorIndex = 0; competitorIndex < this.competitors.length; competitorIndex++)
        {
            if( winner.votes < this.competitors[competitorIndex].votes )
            {
                winner = this.competitors[competitorIndex];
            }
        }
        return winner;
    }
}

module.exports = Game;