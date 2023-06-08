import {Card, Rank, Suit} from "./Player";

type Hand = Card[];

export enum HandRank {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    FourOfAKind,
    StraightFlush,
    RoyalFlush,
}

const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Returns the count of cards of each rank in the hand.
function countRanks(hand: Hand): { [key in Rank]?: number } {
    const counts: { [key in Rank]?: number } = {};

    for (const card of hand) {
        if (counts[card.rank]) {
            counts[card.rank]! += 1;
        } else {
            counts[card.rank] = 1;
        }
    }

    return counts;
}

// Returns the count of cards of each suit in the hand.
function countSuits(hand: Hand): { [key in Suit]?: number } {
    const counts: { [key in Suit]?: number } = {};

    for (const card of hand) {
        if (counts[card.suit]) {
            counts[card.suit]! += 1;
        } else {
            counts[card.suit] = 1;
        }
    }

    return counts;
}

// Checks if there's a pair in the hand.
function isPair(hand: Hand): boolean {
    const counts = countRanks(hand);
    for (const count of Object.values(counts)) {
        if (count === 2) {
            return true;
        }
    }
    return false;
}

// Checks if there's a flush in the hand.
function isFlush(hand: Hand): boolean {
    const counts = countSuits(hand);
    for (const count of Object.values(counts)) {
        if (count === 5) {
            return true;
        }
    }
    return false;
}

// Checks if there's a Three of a Kind in the hand.
function isThreeOfAKind(hand: Hand): boolean {
    const counts = countRanks(hand);
    for (const count of Object.values(counts)) {
        if (count === 3) {
            return true;
        }
    }
    return false;
}

// Checks if there's a Four of a Kind in the hand.
function isFourOfAKind(hand: Hand): boolean {
    const counts = countRanks(hand);
    for (const count of Object.values(counts)) {
        if (count === 4) {
            return true;
        }
    }
    return false;
}

// Checks if there's a Full House in the hand.
function isFullHouse(hand: Hand): boolean {
    const counts = countRanks(hand);
    let foundThree = false;
    let foundTwo = false;

    for (const count of Object.values(counts)) {
        if (count === 3) {
            foundThree = true;
        } else if (count === 2) {
            foundTwo = true;
        }
    }

    return foundThree && foundTwo;
}

// Check if there's a Straight in the hand.
function isStraight(hand: Hand): boolean {
    const indices: number[] = hand.map(card => ranks.indexOf(card.rank)).sort((a, b) => a - b);

    for (let i = 0; i < indices.length - 1; i++) {
        if (indices[i + 1] - indices[i] !== 1) {
            // Special case for Ace being used as low card (1)
            if (i === 0 && indices[0] === 0 && indices[indices.length - 1] === 12) {
                continue;
            } else {
                return false;
            }
        }
    }

    return true;
}


function isSameSuit(hand: Hand): boolean {
    const { suit: targetSuite } = hand[0];
    return hand.every(({ suit }) => suit === targetSuite);
}

function isSequence(hand: Hand): boolean {
    const sortedHand = hand.sort((a, b) => ranks.indexOf(a[0]) - ranks.indexOf(b[0]));
    return sortedHand.every((card, i) => {
        if (i === 0) return true;
        const prevCardRank = ranks.indexOf(sortedHand[i - 1][0]);
        const currCardRank = ranks.indexOf(card[0]);
        return currCardRank - prevCardRank === 1;
    });
}


function isRoyalFlush(hand: Hand): boolean {
    if (!isSameSuit(hand)) return false;
    const sortedHand = hand.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
    return sortedHand[0].rank === '10' && isSequence(hand);
}

function isStraightFlush(hand: Hand): boolean {
    return isSameSuit(hand) && isSequence(hand);
}

function isTwoPair(hand: Hand): boolean {
    const rankCounts = countRanks(hand);
    return Object.values(rankCounts).filter(count => count === 2).length === 2;
}

export function evaluateHand(hand: Hand): HandRank {
    if (isRoyalFlush(hand)) return HandRank.RoyalFlush;
    if (isStraightFlush(hand)) return HandRank.StraightFlush;
    if (isFourOfAKind(hand)) return HandRank.FourOfAKind;
    if (isFullHouse(hand)) return HandRank.FullHouse;
    if (isFlush(hand)) return HandRank.Flush;
    if (isStraight(hand)) return HandRank.Straight;
    if (isThreeOfAKind(hand)) return HandRank.ThreeOfAKind;
    if (isTwoPair(hand)) return HandRank.TwoPair;
    if (isPair(hand)) return HandRank.OnePair;
    return HandRank.HighCard;
}