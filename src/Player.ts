
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

enum HandRating {
  Great,
  Good,
  Poor,
  Bad
}

const GreatStartingHands = {
  'AA': true,
  'KK': true,
  'QQ': true,
  'JJ': true,
  'TT': true,
  '99': true,
  '88': true,
  '77': true,
  'AK': true,
  'AQ': true,
  'AJ': true,
  'AT': true,
  'KQ': true,
  'KJ': true,
  'KT': true,
  'QJ': true,
  'QT': true,
  'JT': true,
  'J9': true,
  'T9': true,
}

const GoodStartingHands = {
  '66': true,
  '55': true,
  'A9': true,
  'A8': true,
  'A7': true,
  'A6': true,
  'K9': true,
  'Q9': true,
  'Q8': true,
  'J8': true,
  'T8': true,
  '98': true,
}

const cardOrder = ["A", "K", "Q", "J", "T", "10", "9", "8", "7", "6", "5", "4", "3", "2"]

function rateStartingHand(card1: Card, card2: Card): HandRating {
  const pos1 = cardOrder.indexOf(card1.rank)
  const pos2 = cardOrder.indexOf(card2.rank)

  const handCode = pos1 > pos2 ? `${card2.rank}${card1.rank}` : `${card1.rank}${card2.rank}`

  if (GreatStartingHands.hasOwnProperty(handCode)) {
    return HandRating.Great
  }
  if (GoodStartingHands.hasOwnProperty(handCode)) {
    return HandRating.Good
  }

  return HandRating.Bad;
}

export default Player;
