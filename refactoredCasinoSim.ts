interface gamblerInterface {
	getBetSize(): number;
    addMoney(amount: number): void;
    isFinished(): boolean;
    name: string;
    money: number;
    pickedNumber?: number;
    pickedPig?: number;
    setPick?: (pick: number) => void;
}

type gameType = TailsIWin | GuessTheNumber | OffTrackGuineaPigRacing;

type gamblerType = StableGambler | HighRiskGambler | StreakGambler | MartingaleGambler;

class TailsIWin {
	casino: Casino;
    _name: string = "Tails I Win";
    _book: Map<gamblerType, number> = new Map();

    constructor(casino: Casino) {
        this.casino = casino;
    }

    playGame(): void {
        console.log("Game:", this._name,);
        this._book.forEach((bet, player) => {
            console.log(" ", player.name, ": $", bet);
        });

        const flipResult = Math.random() < 0.5; // true for heads, false for tails
        console.log(`The coin landed on ${flipResult ? "heads" : "tails"}`);

        const winners = flipResult ? [] : Array.from(this._book.keys());
        console.log("Game finished!");

        winners.forEach(winner => {
            const bet = this._book.get(winner)!;
            const winnings = bet * this.profitMultiplier(winner);
            winner.addMoney(winnings);
            this.casino.addProfit(-winnings);
            console.log(" ", winner.name, "is a winner! They won:", winnings);
        });

        this._book.forEach((bet, gambler) => {
            if (!winners.includes(gambler)) {
                console.log(" ", gambler.name, "has lost!");
                gambler.addMoney(-bet);
                this.casino.addProfit(bet);
            }
        });

        this._book.clear();
    }

    addPlayer(gambler: gamblerType, bet: number): void {
        if (!gambler.isFinished()) {
            this._book.set(gambler, bet);
        }
    }

    getPlayers(): gamblerType[] {
        return Array.from(this._book.keys());
    }

    private profitMultiplier(gambler: gamblerType): number {
        return 1.9;
    }
}

class GuessTheNumber {
    casino: Casino;
    _name: string = "Guess The Number";
    _book: Map<gamblerType, number> = new Map();

    constructor(casino: Casino) {
        this.casino = casino;
    }

    playGame(): void {
        console.log("Game", this._name);
        this._book.forEach((bet, player) => {
            console.log(" ", player.name, ": $", bet);
        });

        const winningNumber = Math.floor(Math.random() * 5); // numbers 0-4 for guessing
        console.log(`Winning number is ${winningNumber}`);

		const winners = Array.from(this._book.keys()).filter(gambler => gambler.pickedNumber === winningNumber);

        winners.forEach(winner => {
            const bet = this._book.get(winner)!;
            const winnings = bet * 4.5; // 4.5x profit multiplier for this game
            winner.addMoney(winnings);
            this.casino.addProfit(-winnings);
            console.log(" ", winner.name, "wins $", winnings);
        });

        this._book.forEach((bet, gambler) => {
            if (!winners.includes(gambler)) {
            	console.log(" ", gambler.name, "has lost!");
                gambler.addMoney(-bet);
                this.casino.addProfit(bet);
            }
        });

        this._book.clear();
    }

    addPlayer(gambler: gamblerType, bet: number): void {
        this._book.set(gambler, bet);
    }

    getPlayers(): gamblerType[] {
        return Array.from(this._book.keys());
    }
}

class OffTrackGuineaPigRacing {
    casino: Casino;
    _name: string = "Off-Track Guinea Pig Racing";
    _book: Map<gamblerType, number> = new Map();

    constructor(casino: Casino) {
        this.casino = casino;
    }

    playGame(): void {
        console.log("Game", this._name);
        this._book.forEach((bet, player) => {
            console.log(" ", player.name, ": $", bet);
        });

        // simulating the guinea pig race
        const winningPig = Math.floor(Math.random() * 4); // four guinea pigs numbered 0-3
        console.log(`Winning pig is #${winningPig}`);

		const winners = Array.from(this._book.keys()).filter(gambler => gambler.pickedPig === winningPig);

        winners.forEach(winner => {
            const bet = this._book.get(winner)!;
            const winnings = bet * this.profitMultiplier(winner, winningPig);
            winner.addMoney(winnings);
            this.casino.addProfit(-winnings);
            console.log(" ", winner.name, "wins $", winnings);
        });

        this._book.forEach((bet, gambler) => {
            if (!winners.includes(gambler)) {
                console.log(" ", gambler.name, "has lost!");
                gambler.addMoney(-bet);
                this.casino.addProfit(bet);
            }
        });

        this._book.clear();
    }

    addPlayer(gambler: gamblerType, bet: number): void {
        if (!gambler.isFinished()) {
            this._book.set(gambler, bet);
        }
    }

    getPlayers(): gamblerType[] {
        return Array.from(this._book.keys());
    }

    private profitMultiplier(gambler: gamblerType, winningPig: number): number {
        // logic to calculate profit multiplier based on the winning pig
        let multiplier = 1; // default
        switch (winningPig) {
            case 0:
                multiplier = 1.9;
                break;
            case 1:
                multiplier = 3.8;
                break;
            case 2:
            case 3:
                multiplier = 7.6;
                break;
            default:
                console.error("Invalid pig selected:", winningPig);
        }
        return multiplier;
    }
}

class StableGambler implements gamblerInterface {
    _name: string;
    _money: number;
    _target: number;
    _bet: number;

    constructor(name: string, startingFunds: number, bet: number) {
        this._name = name;
        this._money = startingFunds;
        this._bet = bet;
        this._target = startingFunds*2;
    }

     get name(): string {
        return this._name;
    }

    get money(): number {
        return this._money;
    }

    getBetSize(): number {
        // returns bet amount
        return this._bet;
    }

    addMoney(amount: number): void {
        // adjusts their money by the amount
        this._money += amount;
    }

    isFinished(): boolean {
        // determines if they has either hit their target or is bankrupt
        return this._money <= 0 || this._money >= this._target;
	}
	pickedNumber?: number;
    pickedPig?: number;
	setPick(pick: number): void {
		this.pickedNumber = pick;
		this.pickedPig = pick;
	}
}

class HighRiskGambler implements gamblerInterface {
	_name: string;
    _money: number;
    _target: number;
    _yoloAmount: number; // if below this amount all ins

    constructor(name: string, startingFunds: number, yoloAmount: number) {
        this._name = name;
        this._money = startingFunds;
        this._yoloAmount = yoloAmount;
        this._target = startingFunds*5;
    }

    get name(): string {
        return this._name;
    }

    get money(): number {
        return this._money;
    }

    getBetSize(): number {
        // all ins if money is below or equal to the yoloAmount otherwise bet half the money
        return this._money <= this._yoloAmount ? this._money : this._money / 2;
    }

    addMoney(amount: number): void {
        this._money += amount;
    }

    isFinished(): boolean {
        return this._money <= 0 || this._money >= this._target;
    }
    pickedNumber?: number;
    pickedPig?: number;
    setPick(pick: number): void {
		this.pickedNumber = pick;
		this.pickedPig = pick;
	}
}


class StreakGambler implements gamblerInterface {
	_name: string;
    _money: number;
    _target: number;
    _initialBet: number;
    _currentBet: number;
    _winMultiplier: number;
    _lossMultiplier: number;
    _streakCount: number = 0; // tracks consecutive wins or losses

    constructor(name: string, startingFunds: number, initialBet: number, winMultiplier: number, lossMultiplier: number, targetFunds: number) {
        this._name = name;
        this._money = startingFunds;
        this._initialBet = initialBet;
        this._currentBet = initialBet;
        this._winMultiplier = winMultiplier;
        this._lossMultiplier = lossMultiplier;
        this._target = targetFunds;
    }

    get name(): string {
        return this._name;
    }

    get money(): number {
        return this._money;
    }

    getBetSize(): number {
        return this._currentBet;
    }

    addMoney(amount: number): void {
        this._money += amount;
        // adjusts  bet size based on the result of the last game
        if (amount > 0) { // Win
            this._currentBet = Math.min(this._money, this._currentBet * this._winMultiplier);
            this._streakCount = Math.max(0, this._streakCount + 1); // Increments win streak
        } else {
            this._currentBet = Math.max(this._initialBet, this._currentBet * this._lossMultiplier);
            this._streakCount = Math.min(0, this._streakCount - 1); // increments loss streak
        }
    }

    isFinished(): boolean {
        return this._money <= 0 || this._money >= this._target;
    }
    pickedNumber?: number;
    pickedPig?: number;
    setPick(pick: number): void {
		this.pickedNumber = pick;
		this.pickedPig = pick;
	}
}

class MartingaleGambler implements gamblerInterface {
    _name: string;
    _money: number;
    _target: number;
    _initialBet: number;
    _currentBet: number;

    constructor(name: string, startingFunds: number, initialBet: number, targetFunds: number) {
        this._name = name;
        this._money = startingFunds;
        this._initialBet = initialBet;
        this._currentBet = initialBet;
        this._target = targetFunds;
    }

    get name(): string {
        return this._name;
    }

    get money(): number {
        return this._money;
    }

    getBetSize(): number {
        // Ensure the bet does not exceed the gambler's current funds
        return Math.min(this._currentBet, this._money);
    }

    addMoney(amount: number): void {
        this._money += amount;
        if (amount > 0) {
            // wins reset the bet to the initial amount
            this._currentBet = this._initialBet;
        } else {
            // losses double the bet, ensuring it doesn't exceed the gambler's remaining money
            // calculation is done before the loss is subtracted from _money
            this._currentBet = Math.min(this._money, this._currentBet * 2);
        }
    }

    isFinished(): boolean {
        return this._money <= 0 || this._money >= this._target;
    }
    pickedNumber?: number;
    pickedPig?: number;
    setPick(pick: number): void {
		this.pickedNumber = pick;
		this.pickedPig = pick;
	}
}


class Casino {
	// list of games
	private _games: gameType[] = [];

	// set of guests
	private _gamblers: Set<gamblerType>;

	// casino's profit
	private _profits: number = 0;

	// maximum number of rounds to play
	private _maxRounds: number;
	private _currentRound: number = 0;

	constructor(maxRounds: number){
		this._maxRounds = maxRounds;
		this.addGame(new TailsIWin(this));
        this.addGame(new GuessTheNumber(this));
        this.addGame(new OffTrackGuineaPigRacing(this));
		this._gamblers = new Set<gamblerType>([
            new StableGambler("Alice", 100, 15),
            new HighRiskGambler("Bob", 50, 10),
            new StreakGambler("Camille", 200, 10, 2, 0.5, 500),
            new MartingaleGambler("Martin", 300, 10, 1000),
        ]);

	}

	public addGame(game: gameType): void {
    this._games.push(game);
	}

    public addGambler(gambler: gamblerType): void {
        this._gamblers.add(gambler);
    }

	public addProfit(amount: number): void {
		this._profits += amount;
	}

	// assigns each gambler a number and pig prior to needed it
	private setPicksForGame(game: gameType): void {
    this._gamblers.forEach(gambler => {
        if ('setPick' in gambler) {
            if (game instanceof GuessTheNumber) {
                gambler.setPick(Math.floor(Math.random() * 5));
            } else if (game instanceof OffTrackGuineaPigRacing) {
                gambler.setPick(Math.floor(Math.random() * 4));
            }
        }
    });
}

    public simulateOneRound(): void {
        console.log("-----------------------");
        console.log(`Beginning round ${this._currentRound + 1}`);
        this.determineWhoIsStillPlaying();
        console.log("Casino Profits:", this._profits);

        this._games.forEach(game => {
        	// assigns each gambler a pick before playing game
        	this.setPicksForGame(game);
            this._gamblers.forEach(gambler => {
                if (!gambler.isFinished()) {
                    let bet = gambler.getBetSize();
                    game.addPlayer(gambler, bet);
                }
            });

            if (game instanceof TailsIWin) {
                game.playGame();
            } else if (game instanceof GuessTheNumber) {
                game.playGame();
            } else if (game instanceof OffTrackGuineaPigRacing) {
                game.playGame();
            }
        });
        console.log("-----------------------");
        this._currentRound++;
    }

	// run simulation until max games are eached or all players are gone
	public simulate(): void {
        while (this._currentRound < this._maxRounds && this._gamblers.size > 0) {
            this.simulateOneRound();
        }
        console.log("Simulation complete. Total profit:", this._profits);
    }
    
	// updates players list
	private determineWhoIsStillPlaying(): void {
		this._gamblers.forEach(gambler => {
			console.log(gambler.name, ":", gambler.money);
			if (gambler.isFinished()) {
				this._gamblers.delete(gambler);
				if (gambler.money >= gambler._target) {
					console.log(gambler.name, "has hit their target! They leave the casino...");
				}
				else if (gambler.money <= 0) {
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