export class BaseballGame {
    constructor() {
        this.keys = [];
        this.status = 'Ready to Play';
        this.guesses = [];
        this.guesses.length = 0;
        this.strikes = 0;
        this.balls = 0;
        this.playing = true; //trigger game ending
        this.attemps = 0; // indicate turns
    }

    generateKeys() {
        //array of numbers between 0 and 9 
        const numbers = Array.from(Array(10).keys());
        //shuffle that array
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        //pick first 3 numbers: 
        for (let i = 0; i < 3; i++) {
            this.keys.push(numbers[i]);
        }
    }

    setStrikes() {
        for (let i = 0; i < 3; i++) {
            if (this.guesses[i] == this.keys[i]) this.strikes++;
        }
    }
    setBalls() {
        for (let i = 0; i < 3; i++){
            for(let j = 0 ; j < 3; j++){
                if(i != j && this.guesses[j] == this.keys[i]) this.balls++;
            }
        }

    }
}