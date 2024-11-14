export default class Game {

    constructor() {
        this.STATE = "START";
        this.hand_cards = [];

        this.totalPoints = 0;

        this.currentScore = 0;
        this.currentHandScore = 0;
        this.currentMulti = 0;

        this.duitseFranken = 10000;
        this.discards = 5;

        this.currentRound = 0;
        this.maxAnte = 0;
        this.ante = 0;
    }


}