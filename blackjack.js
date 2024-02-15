"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var cardSuit;
(function (cardSuit) {
    cardSuit[cardSuit["Hearts"] = 0] = "Hearts";
    cardSuit[cardSuit["Spades"] = 1] = "Spades";
    cardSuit[cardSuit["Clubs"] = 2] = "Clubs";
    cardSuit[cardSuit["Diamonds"] = 3] = "Diamonds";
})(cardSuit || (cardSuit = {}));
var cardRank;
(function (cardRank) {
    cardRank[cardRank["Ace"] = 1] = "Ace";
    cardRank[cardRank["Two"] = 2] = "Two";
    cardRank[cardRank["Three"] = 3] = "Three";
    cardRank[cardRank["Four"] = 4] = "Four";
    cardRank[cardRank["Five"] = 5] = "Five";
    cardRank[cardRank["Six"] = 6] = "Six";
    cardRank[cardRank["Seven"] = 7] = "Seven";
    cardRank[cardRank["Eight"] = 8] = "Eight";
    cardRank[cardRank["Nine"] = 9] = "Nine";
    cardRank[cardRank["Ten"] = 10] = "Ten";
    cardRank[cardRank["Jack"] = 10] = "Jack";
    cardRank[cardRank["Queen"] = 10] = "Queen";
    cardRank[cardRank["King"] = 10] = "King";
})(cardRank || (cardRank = {}));
var Card = /** @class */ (function () {
    function Card(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    Object.defineProperty(Card.prototype, "value", {
        // returns value of card
        get: function () {
            return this.rank;
        },
        enumerable: false,
        configurable: true
    });
    // converts card to string
    Card.prototype.toString = function () {
        return " ".concat(cardRank[this.rank], " of ").concat(cardSuit[this.suit]);
    };
    return Card;
}());
var Deck = /** @class */ (function () {
    function Deck() {
        this.cards = [];
        this.initDeck();
    }
    // fills deck with 1 of each card from each suit and rank
    Deck.prototype.initDeck = function () {
        var _this = this;
        // iterate over the suit and rank values
        Object.values(cardSuit).forEach(function (suit) {
            if (typeof suit === 'number') {
                Object.values(cardRank).forEach(function (rank) {
                    if (typeof rank === 'number') {
                        _this.cards.push(new Card(suit, rank));
                    }
                });
            }
        });
    };
    // randomizes order of cards
    Deck.prototype.shuffle = function () {
        var _a;
        for (var i = this.cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [this.cards[j], this.cards[i]], this.cards[i] = _a[0], this.cards[j] = _a[1];
        }
    };
    // removes and returns the last card in deck. If the deck is empty then it is undefined
    Deck.prototype.deal = function () {
        return this.cards.pop();
    };
    return Deck;
}());
// 
var Player = /** @class */ (function () {
    function Player(name) {
        this.hand = [];
        this.name = name;
    }
    Player.prototype.drawCard = function (card) {
        this.hand.push(card);
    };
    Object.defineProperty(Player.prototype, "score", {
        get: function () {
            var score = 0;
            var aceCount = 0; // tracks # of aces in hand n adjusts value if needed
            for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
                var card = _a[_i];
                score += card.value;
                if (card.rank == cardRank.Ace) {
                    aceCount++;
                }
            }
            //if score is > 21 and results in a bust adjust the score of Ace from 11 to 1
            while (score > 21 && aceCount > 0) {
                score -= 10;
                aceCount--;
            }
            return score;
        },
        enumerable: false,
        configurable: true
    });
    //returns the player's hand
    Player.prototype.playerHand = function () {
        return this.hand.map(function (card) { return card.toString(); }).join(',');
    };
    return Player;
}());
// game logic
var Main = /** @class */ (function () {
    function Main() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.deck = new Deck();
        this.player = new Player("Player");
        this.dealer = new Player("Dealer");
    }
    // initializes and starts game
    Main.prototype.startGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.deck.shuffle();
                        this.dealCards();
                        this.showCards();
                        return [4 /*yield*/, this.playerTurn()];
                    case 1:
                        _a.sent();
                        if (this.player.score <= 21) {
                            this.dealerTurn();
                        }
                        this.outcome();
                        this.rl.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    // deals card to player and dealer
    Main.prototype.dealCards = function () {
        for (var i = 0; i < 2; i++) {
            this.player.drawCard(this.deck.deal());
            this.dealer.drawCard(this.deck.deal());
        }
    };
    // shows both cards from player and only 1 card from dealer
    Main.prototype.showCards = function () {
        var _a;
        console.log("Dealer's card: ".concat((_a = this.dealer.hand[1]) === null || _a === void 0 ? void 0 : _a.toString()));
        console.log("Player's cards: ".concat(this.player.playerHand(), ", Score: ").concat(this.player.score));
    };
    // player logic hit or stay
    Main.prototype.playerTurn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerMove;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPlayerMove()];
                    case 1:
                        playerMove = _a.sent();
                        if (playerMove == 'h') {
                            this.player.drawCard(this.deck.deal());
                            console.log("Player hit: ".concat(this.player.playerHand(), ", Score: ").concat(this.player.score));
                            if (this.player.score > 21) {
                                console.log("Player bust");
                                return [3 /*break*/, 3];
                            }
                        }
                        _a.label = 2;
                    case 2:
                        if (playerMove !== 's') return [3 /*break*/, 0];
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.getPlayerMove = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.rl.question('Select to (h)it or (s)tay. ', function (answer) {
                resolve(answer.trim().toLowerCase());
            });
        });
    };
    // sims dealer's turn, hits until a score of 17+
    Main.prototype.dealerTurn = function () {
        console.log("Dealer's hand: ".concat(this.dealer.playerHand(), ", Score: ").concat(this.dealer.score));
        while (this.dealer.score < 17) {
            this.dealer.drawCard(this.deck.deal());
            console.log("Dealer hits: ".concat(this.dealer.playerHand(), ", Score: ").concat(this.dealer.score));
        }
        if (this.dealer.score > 21) {
            console.log("Dealer bust");
        }
    };
    // calculates outcome
    Main.prototype.outcome = function () {
        if (this.player.score > 21) {
            console.log("Dealer wins");
        }
        else if (this.player.score > this.dealer.score || this.dealer.score > 21) {
            console.log("Player wins");
        }
        else if (this.player.score < this.dealer.score) {
            console.log("Dealer wins");
        }
        else {
            console.log("Player and Dealer push");
        }
    };
    return Main;
}());
// runs game
var game = new Main();
game.startGame().catch(function (err) { return console.error(err); });
