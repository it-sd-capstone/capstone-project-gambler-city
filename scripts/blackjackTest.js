// blackjackTest.js

export function calculateScore(hand) {
  let score = 0;
  let aceCount = 0;

  hand.forEach(card => {
    const cardValue = card.slice(0, -1); // Get the numeric value

    if (cardValue === "1") {
      aceCount++;
      score += 11;
    } else if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
      score += 10;
    } else {
      score += parseInt(cardValue, 10);
    }
  });

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
}

export function hit(hand, card) {
  hand.push(card);
  return hand;
}

export function resetGame() {
  return {
    playerHand: [],
    dealerHand: [],
    gameOver: false,
    winner: null
  };
}

export function checkWinner(playerHand, dealerHand) {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) return 'dealer'; 
  if (dealerScore > 21) return 'player'; 
  if (playerScore > dealerScore) return 'player';
  if (dealerScore > playerScore) return 'dealer';
  return 'draw';
}

