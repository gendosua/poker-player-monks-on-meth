
type BetCall = (bet: number) => void;
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type Suit = "spades" | "hearts" | "clubs" | "diamonds";
type Card = {
  rank: Rank,
  suit: Suit 
}

export type PlayerInGame = {
  id: number,
  name: string,
  status: string,
  stack: number,
  bet: number,
  hole_cards?: Card[]
}

export type GameState = {
  tournament_id: number,
  game_id: number,
  current_buy_in: number,
  minimum_raise: number,
  bet_index: number,
  small_blind: number,
  players: PlayerInGame[],
  community_cards: any[],
  in_action: number,
  dealer: number
}
export class Player {
  public betRequest(gameState: GameState, betCallback: BetCall): void {
    betCallback(this.generateRandomInteger(250, 500));
  }

  private generateRandomInteger(min: number, max: number): number {
    return Math.floor(min + Math.random()*(max - min + 1))
  }

  public showdown(gameState: any): void {

  }

  public check(betCallback: BetCall) {
    return betCallback(0)
  }

  public call(gameState: GameState, betCallback: BetCall) {
    const currentBuy = gameState.current_buy_in;
    const playerBet = gameState.players[gameState.in_action].bet
    betCallback(currentBuy - playerBet);
  }


};

export default Player;
