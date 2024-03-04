var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game = /** @class */ (function () {
    function Game(casino, name) {
        this.casino = casino;
        this._name = name;
        this._book = new Map();
    }
    Object.defineProperty(Game.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.profitMultiplier = function (_gamblers) {
        return 2;
    };
    Game.prototype.playGame = function () {
        var _this = this;
        console.log("playing", this.name, "with book:");
        this._book.forEach(function (bet, player) {
            console.log(" ", player.name, ": $", bet);
        });
        var winners = this.simulateGame();
        console.log("game finished!");
        winners.forEach(function (winner) {
            var bet = _this._book.get(winner);
            var winnings = bet * _this.profitMultiplier(winner);
            winner.addMoney(winnings);
            _this.casino.addProfit(-winnings);
            console.log(" ", winner.name, "is a winner! They won:", winnings);
            _this._book.delete(winner);
        });
        this._book.forEach(function (bet, loser) {
            console.log(" ", loser.name, "has lost!");
            loser.addMoney(-bet);
            _this.casino.addProfit(bet);
            _this._book.delete(loser);
        });
    };
    Game.prototype.addPlayer = function (gambler, bet) {
        this._book.set(gambler, bet);
    };
    Game.prototype.getPlayers = function () {
        return Array.from(this._book.keys());
    };
    return Game;
}());
var TailsIWin = /** @class */ (function (_super) {
    __extends(TailsIWin, _super);
    function TailsIWin(casino) {
        return _super.call(this, casino, "Tails I Win") || this;
    }
    TailsIWin.prototype.simulateGame = function () {
        var flipResult = Math.random() < 0.5; // true for heads, false for tails
        console.log("The coin landed on ".concat(flipResult ? "heads" : "tails"));
        // everyone wins if tails
        return flipResult ? [] : Array.from(this.getPlayers());
    };
    TailsIWin.prototype.profitMultiplier = function (_gamblers) { return 1.9; };
    return TailsIWin;
}(Game));
function randomInt(upper) {
    // Math.random() goes between 0 and 1, but never hits exactly 1
    return Math.floor(Math.random() * upper);
}
var GuessTheNumber = /** @class */ (function (_super) {
    __extends(GuessTheNumber, _super);
    function GuessTheNumber(casino) {
        return _super.call(this, casino, "Guess The Number") || this;
    }
    GuessTheNumber.prototype.simulateGame = function () {
        var winningNumber = randomInt(5);
        console.log("Winning number is ".concat(winningNumber));
        return this.getPlayers().filter(function (gambler) { return gambler.pickedNumber === winningNumber; });
    };
    GuessTheNumber.prototype.profitMultiplier = function (_gambler) { return 4.5; };
    return GuessTheNumber;
}(Game));
var OffTrackGuineaPigRacing = /** @class */ (function (_super) {
    __extends(OffTrackGuineaPigRacing, _super);
    function OffTrackGuineaPigRacing(casino) {
        return _super.call(this, casino, "Off-Track Guina Pig Racing") || this;
    }
    OffTrackGuineaPigRacing.prototype.simulateGame = function () {
        var winningPig = randomInt(4);
        console.log("Winning pig is #".concat(winningPig));
        // Filter players who picked the winning pig
        return this.getPlayers().filter(function (gambler) { return gambler.pickedPig === winningPig; });
    };
    OffTrackGuineaPigRacing.prototype.profitMultiplier = function (gambler) {
        var pickedPig = gambler.pickedPig;
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
    };
    return OffTrackGuineaPigRacing;
}(Game));
var Gambler = /** @class */ (function () {
    function Gambler(name, startingFunds, targetFunds) {
        this._name = name;
        this._money = startingFunds;
        this._target = targetFunds;
    }
    Object.defineProperty(Gambler.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gambler.prototype, "money", {
        get: function () {
            return this._money;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Gambler.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: false,
        configurable: true
    });
    Gambler.prototype.addMoney = function (amount) {
        this._money += amount;
    };
    Gambler.prototype.isFinished = function () {
        return this.bankrupt() || this.hitTarget();
    };
    Gambler.prototype.bankrupt = function () {
        return this._money <= 0;
    };
    Gambler.prototype.hitTarget = function () {
        return this._money >= this._target;
    };
    return Gambler;
}());
var StableGambler = /** @class */ (function (_super) {
    __extends(StableGambler, _super);
    function StableGambler(name, startingFunds, stableBet) {
        // the target is double the starting funds
        var _this = _super.call(this, name, startingFunds, startingFunds * 2) || this;
        _this._bet = stableBet;
        return _this;
    }
    StableGambler.prototype.getBetSize = function () {
        return Math.min(this._money, this._bet);
    };
    return StableGambler;
}(Gambler));
var HighRiskGambler = /** @class */ (function (_super) {
    __extends(HighRiskGambler, _super);
    function HighRiskGambler(name, startingFunds, yoloAmount) {
        var _this = _super.call(this, name, startingFunds, startingFunds * 5) || this;
        _this._yoloAmount = yoloAmount;
        return _this;
    }
    HighRiskGambler.prototype.getBetSize = function () {
        // bet all in if below yoloAmount, else bet half
        return this.money <= this._yoloAmount ? this.money : this.money / 2;
    };
    return HighRiskGambler;
}(Gambler));
var StreakGambler = /** @class */ (function (_super) {
    __extends(StreakGambler, _super);
    function StreakGambler(name, startingFunds, initialBet, minimumBet, winMultiplier, lossMultiplier, target) {
        var _this = _super.call(this, name, startingFunds, target) || this;
        _this._initialBet = initialBet;
        _this._currentBet = initialBet;
        _this._minimumBet = minimumBet;
        _this._winMultiplier = winMultiplier;
        _this._lossMultiplier = lossMultiplier;
        return _this;
    }
    StreakGambler.prototype.getBetSize = function () {
        // will never bet less than min
        return Math.max(this._currentBet, this._minimumBet);
    };
    // adjusts bet size based on win/loss
    StreakGambler.prototype.addMoney = function (amount) {
        _super.prototype.addMoney.call(this, amount);
        if (amount > 0) {
            this._currentBet = Math.max(this._currentBet * this._winMultiplier, this._minimumBet);
        }
        else {
            this._currentBet = Math.max(this._currentBet * this._lossMultiplier, this._minimumBet);
        }
    };
    return StreakGambler;
}(Gambler));
var MartingaleGambler = /** @class */ (function (_super) {
    __extends(MartingaleGambler, _super);
    function MartingaleGambler(name, startingFunds, initialBet, target) {
        var _this = _super.call(this, name, startingFunds, target) || this;
        _this.initialBet = initialBet;
        _this.currentBet = initialBet;
        return _this;
    }
    MartingaleGambler.prototype.getBetSize = function () {
        // prevents bet from exceeding what's available
        return Math.min(this.currentBet, this._money);
    };
    MartingaleGambler.prototype.addMoney = function (amount) {
        // win then reset the bet back to inital amount
        // if loss then double the bet
        if (amount > 0) {
            this.currentBet = this.initialBet;
        }
        else {
            this.currentBet = Math.min(this.currentBet * 2, this._money);
        }
        _super.prototype.addMoney.call(this, amount - this.currentBet);
    };
    return MartingaleGambler;
}(Gambler));
var Casino = /** @class */ (function () {
    function Casino(maxRounds) {
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
    Casino.prototype.addProfit = function (amount) {
        this._profits += amount;
    };
    Casino.prototype.simulateOneRound = function () {
        console.log("-----------------------");
        console.log("Beginning round ".concat(this._currentRound + 1));
        this.determineWhoIsStillPlaying();
        var _loop_1 = function (game) {
            this_1._gamblers.forEach(function (gambler) {
                if (!gambler.isFinished()) {
                    game.addPlayer(gambler, gambler.getBetSize());
                }
            });
            var gameStartingProfit = this_1._profits;
            game.playGame();
            console.log("Casino made ".concat(this_1._profits - gameStartingProfit, " on ").concat(game.name));
        };
        var this_1 = this;
        for (var _i = 0, _a = this._games; _i < _a.length; _i++) {
            var game = _a[_i];
            _loop_1(game);
        }
        console.log("Round complete. Casino made: ".concat(this._profits - this._currentRound));
        console.log("Total profit: ".concat(this._profits));
        console.log("-----------------------");
        this._currentRound++;
    };
    // run simulation until max games are eached or all players are gone
    Casino.prototype.simulate = function () {
        while (this._currentRound < this._maxRounds && this._gamblers.size > 0) {
            this.simulateOneRound();
            this._currentRound++;
        }
        console.log("Simulation complete");
    };
    // updates players list
    Casino.prototype.determineWhoIsStillPlaying = function () {
        var _this = this;
        this._gamblers.forEach(function (gambler) {
            console.log(gambler.name, ":", gambler.money);
            if (gambler.isFinished()) {
                _this._gamblers.delete(gambler);
                if (gambler.hitTarget()) {
                    console.log(gambler.name, "has hit their target! They leave the casino...");
                }
                else if (gambler.bankrupt()) {
                    console.log(gambler.name, "has gone bankrupt! They leave the casino...");
                }
            }
        });
    };
    return Casino;
}());
var MAX_N_ROUNDS = 5;
// main:
var casino = new Casino(MAX_N_ROUNDS);
casino.simulate();
