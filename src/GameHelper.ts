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

    public isPreFloc(): boolean {
        return this.gameState.round === 0;
    }

    public isFloc(): boolean {
        return this.gameState.round === 1;
    }

    public isTurn(): boolean {
        return this.gameState.round === 2;
    }

    public isRiver(): boolean {
        return this.gameState.round === 3;
    }
}
