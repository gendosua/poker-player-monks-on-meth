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
        if (this.gameState.round === 0) {
            console.log(`======== PreFlop, round ${this.gameState.round} =========`)
        }
        return this.gameState.round === 0;
    }

    public isFlop(): boolean {
        if (this.gameState.round === 1) {
            console.log(`======== Flop, round ${this.gameState.round} =========`)
        }
        return this.gameState.round === 1;
    }

    public isTurn(): boolean {
        if (this.gameState.round === 2) {
            console.log(`======== Turn, round ${this.gameState.round} =========`)
        }
        return this.gameState.round === 2;
    }

    public isRiver(): boolean {
        if (this.gameState.round === 3) {
            console.log(`======== River, round ${this.gameState.round} =========`)
        }
        return this.gameState.round === 3;
    }

    public getCommunityCards() {
        return this.gameState.community_cards;
    }
}
