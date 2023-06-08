import { GameStateHelper } from "./GameHelper";
import { evaluateHand } from "./combinations";

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
  pot: number,
}

function afterFlop(gameStateInstance: GameStateHelper, gameState: GameState,  myPlayer: PlayerInGame, betCallback: BetCall) {
  gameStateInstance.printHand()
  const handRank = evaluateHand([myPlayer.hole_cards[0], myPlayer.hole_cards[1], ...gameState.community_cards])

  console.log(`++++ Monks: hand rank ${handRank}  ++++`)

  if (handRank > 6) {
    this.raise(
        gameState,
        betCallback,
        gameStateInstance.isRiver()
            ? gameState.players[gameState.in_action].stack/2
            : (
                gameStateInstance.isTurn()
                ? Math.floor(gameState.players[gameState.in_action].stack/10)
                : Math.floor(gameState.players[gameState.in_action].stack/15)
            )
    )
    return;
  }

  if (handRank > 2) {
    this.raise(gameState, betCallback)
    return;
  }

  if (handRank > 0) {
    this.call(gameState, betCallback)
    return;
  }

  this.check(betCallback)
  return;
}
export class Player {
  public betRequest(gameState: GameState, betCallback: BetCall): void {
    const gameStateInstance = new GameStateHelper(gameState); 
    const me = gameStateInstance.getMyPlayer()
    const initialHandRate = rateStartingHand(me.hole_cards[0], me.hole_cards[1])

    if (gameStateInstance.isFlop() || gameStateInstance.isTurn() || gameStateInstance.isRiver()) {
      afterFlop.call(this, gameStateInstance, gameState, me, betCallback)
      return 
    }

    if (gameStateInstance.isPreFlop()) {
      console.log(`++++ Monks: pre-flop hand rank ${initialHandRate}  ++++`)

      gameStateInstance.printHand()
      if (initialHandRate === InitialHandRating.Bad) {
        this.check(betCallback)
        return 
      }
  
      if (initialHandRate === InitialHandRating.Good) {
        this.call(gameState, betCallback)
        return
      }

      this.raise(gameState, betCallback, Math.floor(gameState.players[gameState.in_action].stack/10))
      return;
    }


    this.check(betCallback)
  }

  public showdown(gameState: GameState): void {
      console.log(` ******** 🥷Showdown 🥷 ********`)
      console.log(JSON.stringify(gameState, null, 0))
  }

  public check(betCallback: BetCall) {
    console.log(`+++ 👋 Monks check +++ 👋`)
    return betCallback(0)
  }

  public call(gameState: GameState, betCallback: BetCall): void {
    const currentBuy = gameState.current_buy_in;
    const playerBet = gameState.players[gameState.in_action].bet;
    const callAmount = currentBuy - playerBet

    console.log(`++++ 📞 Monks: call ${callAmount} (min_raise=${gameState.minimum_raise}, cur_buy_in=${gameState.current_buy_in}, curr_bet=${playerBet}) 📞+++`)
    betCallback(callAmount);
  }

  public canRaise(gameState: GameState, newBet): boolean {
    const moneyLeft = gameState.players[gameState.in_action].stack

    return moneyLeft >= newBet
  }

  public raise(gameState: GameState, betCallback: BetCall, raiseAmount = 10): void {
    const currentBuy = gameState.current_buy_in;
    const playerBet = gameState.players[gameState.in_action].bet
    const newBet = currentBuy - playerBet + gameState.minimum_raise + raiseAmount

    const correctBet = Math.min(newBet, gameState.players[gameState.in_action].stack)

    if (!this.canRaise(gameState, correctBet)) {
      console.log(`++++ Monks: tried but can't raise ❌ ++++`)
      return this.call(gameState, betCallback)
    }

    console.log(`++++ 💰 Monks: raise ${correctBet} (min_raise=${gameState.minimum_raise}, cur_buy_in=${gameState.current_buy_in}, curr_bet=${playerBet})  💰 ++++`)

    betCallback(correctBet);
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
