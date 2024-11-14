export default class Game {

    constructor() {
        this.totalPoints = 0;

        this.currentScore = 0;
        this.currentHandScore = 0;
        this.currentMulti = 0;

        this.duitseFranken = 0;
        this.hands = 5;
        this.discards = 5;

        this.currentRound = 0;
        this.maxAnte = 0;
        this.ante = 0;
    }
}