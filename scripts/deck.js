//Functions
function printDeck(deck) {
  console.log(deck);
}

function printDeckValues(deck) {
  let deckValues = [];
  deck.forEach((element) => {
    element = element.slice(0, -1);
    deckValues.push(element);
  })
  console.log(deckValues);
}

function getCardValue(card) {
  return parseInt(card.substring(0, card.length - 1));
}

function getCardSuit(card) {
  return card[card.length - 1];
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
 
function dealDeck(deck, playerHands, numOfPlayers, numOfCards) {
  shuffleDeck(deck);
  for(let i = 0; i < numOfPlayers; i++) {
    let newHand = [];
    playerHands.push(newHand);
    for(let j = 0; j < numOfCards; j++) { 
      playerHands[i][j] = deck.shift();
    }
  }
}
// Blackjack-specific card value function
function getBlackjackCardValue(card) {
  if (card.value === 'A') return 11;  // Ace is worth 11 by default
  if (card.value === 'K' || card.value === 'Q' || card.value === 'J') return 10;  // Face cards worth 10
  return parseInt(card.value);  // Numbered cards are worth their face value
}


//creat a new deck of 52 cards
function createDeck() {
  const suits = ["C", "D", "H", "S"];
  const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
  let newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push(value + suit);
    }
  }
  return newDeck;
}

function drawCard(deck) {
  return deck.pop();
}

// function resetDeck(deck) {
//   playerHands = [];
//   deck = ['1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C',
//     '1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', '11D', '12D', '13D',
//     '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', '11H', '12H', '13H',
//     '1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S'
//   ]
//   return deck;
// }
export { printDeck, printDeckValues, getCardValue, getCardSuit, shuffleDeck, dealDeck, drawCard, createDeck };