export default class Card {
  static suits = '\u2660 \u2665 \u2663 \u2666'.split(' ');
  static ranks = {
    1: 'a',
    11: 'j',
    12: 'q',
    13: 'k'
  };

  // 0: spades
  // 1: hearts
  // 2: clubs
  // 3: diamonds

  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
  
  toString() {
    const { suits, ranks } = Card;
    const rank = ranks[this.rank] ?? this.rank.toString();
    return `${rank.toUpperCase()}${suits[this.suit]}`;
  }
}
