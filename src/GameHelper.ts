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
}
