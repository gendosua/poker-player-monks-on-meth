import { GameStateHelper } from "./GameHelper";

type BetCall = (bet: number) => void;
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
export type Suit = "spades" | "hearts" | "clubs" | "diamonds";
export type Card = {
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
  round: number,
  current_buy_in: number,
  minimum_raise: number,
  bet_index: number,
  small_blind: number,
  players: PlayerInGame[],
  community_cards: Card[],
  in_action: number,
  dealer: number
}
export class Player {
  public betRequest(gameState: GameState, betCallback: BetCall): void {
    const gameStateInstance = new GameStateHelper(gameState); 
    const me = gameStateInstance.getMyPlayer()
    const initialHandRate = rateStartingHand(me.hole_cards[0], me.hole_cards[1])

    if (gameStateInstance.isPreFloc() || gameStateInstance.isFloc() || gameStateInstance.isTurn() || gameStateInstance.isRiver()) {
      if (initialHandRate === InitialHandRating.Bad) {
        this.check(betCallback)
        return 
      }
  
      if (initialHandRate === InitialHandRating.Good) {
        this.call(gameState, betCallback)
        return
      }
  
      this.raise(gameState, betCallback)
    }
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

  public raise(gameState: GameState, betCallback: BetCall) {
    const currentBuy = gameState.current_buy_in;
    const playerBet = gameState.players[gameState.in_action].bet
    betCallback(currentBuy - playerBet + gameState.minimum_raise);
  }


};

export enum InitialHandRating {
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
  '1010': true,
  '99': true,
  '88': true,
  '77': true,
  'AK': true,
  'AQ': true,
  'AJ': true,
  'A10': true,
  'KQ': true,
  'KJ': true,
  'K10': true,
  'QJ': true,
  'Q10': true,
  'J10': true,
  'J9': true,
  '109': true,
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
  '108': true,
  '98': true,
}

const cardOrder = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"]

function rateStartingHand(card1: Card, card2: Card): InitialHandRating {
  const pos1 = cardOrder.indexOf(card1.rank)
  const pos2 = cardOrder.indexOf(card2.rank)

  const handCode = pos1 > pos2 ? `${card2.rank}${card1.rank}` : `${card1.rank}${card2.rank}`

  if (GreatStartingHands.hasOwnProperty(handCode)) {
    return InitialHandRating.Great
  }
  if (GoodStartingHands.hasOwnProperty(handCode)) {
    return InitialHandRating.Good
  }

  return InitialHandRating.Bad;
}

export default Player;
