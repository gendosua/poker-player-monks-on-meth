import  { GameState, PlayerInGame } from "./Player";


export class GameStateHelper {
    private gameState: GameState
    constructor(constructorParams: GameState){
        this.gameState = constructorParams
    }

    public isBigBlind() {
        // only true because we are two players
        const dealerId = this.gameState.dealer;
        const myId = this.gameState.in_action;
        return dealerId === myId;
    }

    public getMyPlayer(): PlayerInGame {
        return this.gameState.players[this.gameState.in_action]
    }

    public isPreFlop(): boolean {
        if (!this.gameState.community_cards || this.gameState.community_cards.length < 1) {
            console.log(`======== 0️⃣ PreFlop, round ${this.gameState.round} 0️⃣ =========`)
        }
        return !this.gameState.community_cards || this.gameState.community_cards.length < 3;
    }

    public isFlop(): boolean {
        if (this.gameState.community_cards.length === 3) {
            console.log(`======== 1️⃣ Flop, round ${this.gameState.round} 1️⃣ =========`)
        }
        return this.gameState.community_cards.length === 3;
    }

    public isTurn(): boolean {
        if (this.gameState.community_cards.length === 4) {
            console.log(`======== 2️⃣ Turn, round ${this.gameState.round} 2️⃣ =========`)
        }
        return this.gameState.community_cards.length === 4;
    }

    public isRiver(): boolean {
        if (this.gameState.community_cards.length === 5) {
            console.log(`======== 🌊 River, round ${this.gameState.round} 🌊 =========`)
        }
        return this.gameState.community_cards.length === 5;
    }

    public getCommunityCards() {
        return this.gameState.community_cards;
    }

    public getMyHand() {
        const me = this.getMyPlayer()
        return me.hole_cards;
    }

    public printHand() {
        const myCards = this.getMyHand();
        console.log(` My hand is => ${myCards.map(card => `${card.rank}: ${card.suit}`)}`)
    }
}
