abstract class Game {
	protected casino: Casino;
	protected _name: string;
	protected _book: Map<Gambler, number>;

	constructor(casino: Casino, name:string){
		this.casino = casino;
		this._name = name;
		this._book = new Map();
	}

	public get name(): string {
		return this._name
	}


	protected abstract simulateGame(): Gambler[];

	protected profitMultiplier(_gamblers: Gambler): number {
		return 2;
	}

public playGame(): void {
        console.log("playing", this.name, "with book:");
        this._book.forEach((bet, player) => {
            console.log(" ", player.name, ": $", bet);
        });

        const winners = this.simulateGame();
        console.log("game finished!");

        winners.forEach(winner => {
            const bet = this._book.get(winner)!;
            const winnings = bet * this.profitMultiplier(winner);
            winner.addMoney(winnings);
            this.casino.addProfit(-winnings);
            console.log(" ", winner.name, "is a winner! They won:", winnings);
            this._book.delete(winner);
        });

        this._book.forEach((bet, loser) => {
            console.log(" ", loser.name, "has lost!");
            loser.addMoney(-bet);
            this.casino.addProfit(bet);
            this._book.delete(loser);
        });
    }

    public addPlayer(gambler: Gambler, bet: number): void {
        this._book.set(gambler, bet);
    }

    public getPlayers(): Gambler[] {
        return Array.from(this._book.keys());
    }
}

class TailsIWin extends Game {
	constructor(casino: Casino) {
		super(casino, "Tails I Win");
	}

    protected simulateGame(): Gambler[] {
        const flipResult = Math.random() < 0.5; // true for heads, false for tails
        console.log(`The coin landed on ${flipResult ? "heads" : "tails"}`);
        // everyone wins if tails
        return flipResult ? [] : Array.from(this.getPlayers());
    }
	protected profitMultiplier(_gamblers: Gambler): number {return 1.9;}
}

function randomInt( upper: number ) {
    // Math.random() goes between 0 and 1, but never hits exactly 1
    return Math.floor( Math.random() * upper );
}

class GuessTheNumber extends Game {
	constructor(casino:Casino){
		super(casino, "Guess The Number");
	}

	protected simulateGame(): Gambler[]{
		const winningNumber = randomInt(5);
		console.log(`Winning number is ${winningNumber}`);
		return this.getPlayers().filter((gambler: any) => gambler.pickedNumber === winningNumber);
	}
	protected profitMultiplier(_gambler: Gambler): number{return 4.5;}
}

class OffTrackGuineaPigRacing extends Game {
	constructor(casino: Casino) {
		super(casino, "Off-Track Guina Pig Racing");
	}

	protected simulateGame(): Gambler[] {
        const winningPig = randomInt(4);
        console.log(`Winning pig is #${winningPig}`);
        // Filter players who picked the winning pig
        return this.getPlayers().filter(gambler => gambler.pickedPig === winningPig);
    }

	protected profitMultiplier(gambler: Gambler): number {
    let pickedPig = gambler.pickedPig;
    
    switch (pickedPig) {
    	// Pig 0 has a 50% chance of winning pays out 1.9x
        case 0: return 1.9;
        // Pig 1 has a 25% chance of winning pays out 3.8x
        case 1: return 3.8;
        case 2: // Pig 2 has a 12.5% chance of winning pays out 7.6x
        case 3: // Pig 3 has a 12.5% chance of winning pays out 7.6x
            return 7.6;
        default:
            // should never return 0
            console.error("Invalid pig selected:", pickedPig);
            return 0; 
    	}
	}
}

abstract class Gambler {
	protected _name: string;
	protected _money: number;
	protected _target: number;

	[key: string]: any;

	constructor(name: string, startingFunds: number, targetFunds: number) {
		this._name = name;
		this._money = startingFunds;
		this._target = targetFunds;
	}

	abstract getBetSize(): number;

	get name(): string{
		return this._name;
	}

	get money(): number {
		return this._money;
	}

	get target(): number{
		return this._target
	}

	addMoney(amount: number): void{
		this._money += amount;
	}

	isFinished(): boolean {
		return this.bankrupt() || this.hitTarget();
	}

	bankrupt(): boolean {
		return this._money <= 0;
	}

	hitTarget(): boolean {
		return this._money >= this._target;
	}
}

class StableGambler extends Gambler {
	private _bet: number;

	constructor(name: string, startingFunds: number, stableBet: number){
		// the target is double the starting funds
		super(name, startingFunds, startingFunds*2);
		this._bet = stableBet;
	}
	public getBetSize(): number {
		return Math.min(this._money, this._bet);
	}
}

class HighRiskGambler extends Gambler {
	private _yoloAmount: number;

	constructor(name: string, startingFunds: number, yoloAmount: number) {
		super(name, startingFunds, startingFunds*5);
		this._yoloAmount = yoloAmount
	}
	public getBetSize(): number {
		// bet all in if below yoloAmount, else bet half
		return this.money <= this._yoloAmount ? this.money : this.money/2; 
	}
}

class StreakGambler extends Gambler {
	private _initialBet: number;
    private _currentBet: number;
    private _winMultiplier: number;
    private _lossMultiplier: number;
    private _minimumBet: number;

    constructor(name: string, startingFunds: number, initialBet: number, minimumBet: number, winMultiplier: number, lossMultiplier: number, target: number) {
    	super(name, startingFunds, target);
    	this._initialBet = initialBet;
        this._currentBet = initialBet;
        this._minimumBet = minimumBet;
        this._winMultiplier = winMultiplier;
        this._lossMultiplier = lossMultiplier;
    }

    public getBetSize(): number{
    	// will never bet less than min
    	return Math.max(this._currentBet, this._minimumBet);
    }

    // adjusts bet size based on win/loss
    public addMoney(amount: number): void {
    	super.addMoney(amount);
    	if (amount > 0) {
    		this._currentBet = Math.max(this._currentBet * this._winMultiplier, this._minimumBet);
    	}
    	else {
 			this._currentBet = Math.max(this._currentBet* this._lossMultiplier, this._minimumBet);
    	}
    }
}

class MartingaleGambler extends Gambler {
	private initialBet: number;
	private currentBet: number;

	constructor(name: string, startingFunds: number, initialBet: number, target: number){
		super(name,startingFunds, target);
		this.initialBet = initialBet;
		this.currentBet = initialBet;
	}

	public getBetSize(): number {
		// prevents bet from exceeding what's available
		return Math.min(this.currentBet, this._money);
	}

	public addMoney(amount: number): void {
		// win then reset the bet back to inital amount
		// if loss then double the bet
		if (amount > 0) {
			this.currentBet = this.initialBet;
		}
		else {
            this.currentBet = Math.min(this.currentBet * 2, this._money);
		}
		super.addMoney(amount - this.currentBet);
	}
}


class Casino {
	// list of games
	private _games: Game[];

	// set of guests
	private _gamblers: Set<Gambler>;

	// casino's profit
	private _profits: number;

	// maximum number of rounds to play
	private _maxRounds: number;
	private _currentRound: number;

	public constructor(maxRounds: number){
		this._profits = 0;
		this._maxRounds = maxRounds;
		this._currentRound = 0;
		this._games = [
            new TailsIWin(this),
            new GuessTheNumber(this),
            new OffTrackGuineaPigRacing(this)		
        ];
		this._gamblers = new Set([
			// Arg 2 is the amount they start with
            // Arg 3 is how much they bet
			new StableGambler("Alice", 100, 15),

			// Arg 2 is the amount they start with
            // Arg 3 is how much they start betting
			new HighRiskGambler("Bob", 50, 10),

			// Arg 4 is the minimum amount they will bet 
            // Arg 5 is how much they multiply their bet by when they win
            // Arg 6 is how much they multiply their bet by when they lose
            // Arg 7 is target
            new StreakGambler("Camille", 200, 10, 10, 2, 0.5, 500),

            // Arg 3 is inital bet
            // Arg 4 is target
            new MartingaleGambler("Martin", 300, 10, 1000),
		]);

	}

	public addProfit(amount: number): void {
		this._profits += amount;
	}


    public simulateOneRound(): void {
        console.log("-----------------------");
        console.log(`Beginning round ${this._currentRound + 1}`);
        this.determineWhoIsStillPlaying();

        for (let game of this._games) {
            this._gamblers.forEach(gambler => {
                if (!gambler.isFinished()) {
                    game.addPlayer(gambler, gambler.getBetSize());
                }
            });

            const gameStartingProfit = this._profits;
            game.playGame();
            console.log(`Casino made ${this._profits - gameStartingProfit} on ${game.name}`);
        }

        console.log(`Round complete. Casino made: ${this._profits - this._currentRound}`);
        console.log(`Total profit: ${this._profits}`);
        console.log("-----------------------");
        this._currentRound++;
    }

	// run simulation until max games are eached or all players are gone
	public simulate(): void{
		while (this._currentRound < this._maxRounds && this._gamblers.size > 0) {
			this.simulateOneRound();
			this._currentRound++;
		}
		console.log("Simulation complete");
	}

	// updates players list
	private determineWhoIsStillPlaying(): void {
		this._gamblers.forEach(gambler => {
			console.log(gambler.name, ":", gambler.money);
			if (gambler.isFinished()) {
				this._gamblers.delete(gambler);
				if (gambler.hitTarget()) {
					console.log(gambler.name, "has hit their target! They leave the casino...");
				}
				else if (gambler.bankrupt()) {
					console.log(gambler.name, "has gone bankrupt! They leave the casino...");
				}
			}
		});
	}
}

const MAX_N_ROUNDS = 5;

// main:
const casino = new Casino( MAX_N_ROUNDS );

casino.simulate();
