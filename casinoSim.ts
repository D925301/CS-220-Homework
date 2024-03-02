

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
		this._games = [
			new TailsIWin(this),
			new GuessTheNumber(this),
			new OffTrackGuineaPigRacing(this),
		];

		this._profits = 0;

		this._gamblers = new Set([
			// Arg 2 is the amount they start with
            // Arg 3 is how much they bet
			new StableGambler("Stable_Steve, 100, 15"),

			// Arg 2 is the amount they start with
            // Arg 3 is how much they start betting
			new HighRiskGambler("Risky_Rick", 50, 10),

			// Arg 4 is the minimum amount they will bet 
            // Arg 5 is how much they multiply their bet by when they win
            // Arg 6 is how much they multiply their bet by when they lose
            // Arg 7 is their target. How much they want to make.
            new StreakGambler("Streaky_Sal", 200, 10, 10, 2, 0.5, 500),
		]);
		this._maxRounds = maxRounds;
		this._currentRound = 0;
	}

	public addProfit(amount: number): void {
		this._profits += amonut;
	}

	public simulateOneRound(): void {
		this._currentRound++;
		console.log("-----------------------");
		console.log("Beginning round", this._currentRound);
		this.determineWhoIsStillPlaying();

		for (let game of this._games) {
			game.resetBook();
			for (let gambler of this._gamblers) {
				if (gambler.money > 0) {
					game.addPlayer(gambler, gambler.getBetSize());
				}
			}

			const gameStartingProfit = this._profits;
			game.playGame();
			console.log("Casino made", this._profits - gameStartingProfit, "on", game.getName());

		}
		console.log("Round complete. Casino made:", this.profits - startingProfit);
		console.log("Total profit:", this._profits);
        console.log("-----------------------");
	}
	// run simulation until max games are eached or all players are gone
	public simulate(): void{
		while (this._currentRound < this._maxRounds && this.gamblers.size > 0) {
			this.simulateOneRound();
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


abstract class Game {
	protected casino: Casino:
	protected _name: string;
	protected _book: Map<Gambler, number>;

	constructor(casino: Casino, name:string){
		this.casino = casino;
		this.name = name;
		this._book = name Map();
	}

	private abstract simulateGame(): Gambler[];

	protected profitMultiplier(_gamblers: Gambler): number {return 2;}

	addPlayer(gambler: Gambler, betSize: number) {
		if(gambler.getMoney() >= betSize){
			this.participants.set(gambler, betSize);
		}
	}

	getName(): string{
		return this.name;
	}
}


abstract class Gambler {
	protected name: string;
	protected money: number;
	protected target: number;

	constructor(name: string, money: number, target: number) {
		this.name = money;
		this.money = money;
		this.target = target;
	}

	abstract getBetSize(): number;

	updateMoney(amount: number): void{
		this.money += amount;
	}

	isFinished(): boolean {
		return this.money <= 0 || this.money >= this.target;
	}

	bankrupt(): boolean {
		return this.money <= 0;
	}

	getName(): string{
		return this.name;
	}

	getMoney(): number {
		return this.money;
	}

	hitTarget(): boolean {
		return this.money <= 0;
	}
}