
type BetCall = (bet: number) => void
type Card = {
  rank: number,
  suit: string //todo: make this an union type
}

type PlayerInGame = {
  id: number,
  name: string,
  status: string,
  stack: number,
  bet: number,
  hole_cards?: Card[]
}

type GameState = {
  tournament_id: number,
  game_id: number,
  current_buy_in: number,
  minimum_raise: number,
  bet_index: number,
  small_blind: number,
  players: PlayerInGame[],
  community_cards: any[],
  in_action: number
}
export class Player {
  public betRequest(gameState: any, betCallback: BetCall): void {
    betCallback(100);
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
