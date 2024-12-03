import { shuffleDeck, getCardValue, getCardSuit, createDeck, drawCard } from './deck.js';

// Initialize player money from localStorage or default to 100
let playerMoney = localStorage.getItem('playerMoney') ? parseInt(localStorage.getItem('playerMoney')) : 100;

// Update the player money display
document.getElementById('player-money').textContent = `Money: $${playerMoney}`;

const suits = ["C", "D", "H", "S"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

// Function to start a new game of Blackjack
function startBlackjack() {
  deck = createDeck(); // Use local function to create deck
  shuffleDeck(deck);   // Use deck.js function to shuffle

  // Deal initial cards
  playerHand = [drawCard(deck), drawCard(deck)];
  dealerHand = [drawCard(deck), drawCard(deck)];

  displayHands();
}


// Function to display the hands of the player and dealer
function displayHands() {
  const playerHandElement = document.getElementById('player-cards');
  const dealerHandElement = document.getElementById('dealer-cards');
  const playerScoreElement = document.getElementById('player-score');
  const dealerScoreElement = document.getElementById('dealer-score');

  // Clear current displayed hands
  playerHandElement.innerHTML = '';
  dealerHandElement.innerHTML = '';

  // Display player's hand
  playerHand.forEach(card => {
    const cardElement = createCardElement(card);
    //cardElement.textContent = `${getCardValue(card)} of ${getCardSuit(card)}`; CARD AS TEXT
    playerHandElement.appendChild(cardElement);
  });

  console.log("Displaying dealer's hand:", dealerHand);

  // Display dealer's hand (only show one card if the game is ongoing)
  dealerHand.forEach((card, index) => {
    const isFaceDown = index === 0 && !gameOver;
    const cardElement = createCardElement(card, isFaceDown); 
    //cardElement.textContent = `${getCardValue(card)} of ${getCardSuit(card)}`; CARD AS TEXT
    dealerHandElement.appendChild(cardElement);
    console.log(`Card: ${card}, FaceDown: ${isFaceDown}`);
  });


  // If the game is over, reveal the dealer card
  if (gameOver) {
    const dealerFirstCardElement = dealerHandElement.querySelector('img'); // Select the first card (face-down initially)
    if (dealerFirstCardElement) {
      const dealerFirstCard = dealerHand[0]; // Get the first card in the dealer's hand
      const dealerCardValue = getCardValue(dealerFirstCard);
      const dealerCardSuit = getCardSuit(dealerFirstCard);

      // Update the first card's image to the correct card
      const suitMap = {
        C: 'clubs',
        D: 'diamonds',
        H: 'hearts',
        S: 'spades'
      };
      // Update the first card's image to the correct card
      dealerFirstCardElement.src = `../images/cards/${suitMap[dealerCardSuit[0].toUpperCase()]}/${dealerCardValue}${dealerCardSuit[0].toUpperCase()}.png`;
      dealerFirstCardElement.alt = `${dealerCardValue} of ${dealerCardSuit}`;
    }
    // Also reveal all remaining dealer cards
    // dealerHand.slice(1).forEach(card => {
    //   const cardElement = createCardElement(card, false);
    //   dealerHandElement.appendChild(cardElement);
    // });
  }
  // Update and display scores (only once here)
  playerScoreElement.textContent = calculateScore(playerHand);
  dealerScoreElement.textContent = gameOver ? calculateScore(dealerHand) : '?';
}

//function to show card image
function createCardElement(card, isFaceDown = false) {
  const cardImg = document.createElement('img');
  const cardValue = getCardValue(card); // Retrieve card value (e.g., '1')
  const cardSuit = getCardSuit(card); // Retrieve full suit name (e.g., 'spades')

  // Map suit initials to their full names
  const suitMap = {
    C: 'clubs',
    D: 'diamonds',
    H: 'hearts',
    S: 'spades'
  };

  // Get the first letter of the suit in uppercase
  const suitInitial = cardSuit[0].toUpperCase();

  // Adjust the path based on the actual file structure
  let cardImgSrc = isFaceDown
  ? '../images/cards/cardbacks.png'
  : `../images/cards/${suitMap[suitInitial]}/${cardValue}${suitInitial}.png`;
  console.log("Image Path:", cardImgSrc);

  // Set the image source and alt text
  cardImg.src = cardImgSrc;
  cardImg.alt = isFaceDown ? 'Card Back' : `${cardValue} of ${cardSuit}`;
  cardImg.className = 'card-image';

  return cardImg;
}

// Function to calculate the score of a hand
function calculateScore(hand) {
  let score = 0;
  let aceCount = 0;

  hand.forEach(card => {
    const cardValue = card.slice(0, -1); // Get the numeric value
    console.log(`Card: ${card}, Card Value: ${cardValue}`);

    if (cardValue === "1") {
      aceCount++;
      score += 11;
    } else if (cardValue !== "1" && cardValue> 10) {
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

// Function to handle "Hit"
function hit() {
  if (gameOver) return;
  playerHand.push(drawCard(deck));  // Draw a card for the player
  displayHands();  // Display the updated hands

  console.log(`Player Score after hit: ${calculateScore(playerHand)}`);
  
  if (calculateScore(playerHand) > 21) {
    gameOver = true;  // End the game if player busts
    displayHands();  // Re-display hands to show the bust
    determineWinner();  // Determine and show the result
  }
}

// Function to handle "Stand"
function stand() {
  if (gameOver) return;

  console.log("Standing...");

  // Reveal the dealer's first card
  const dealerHandElement = document.getElementById('dealer-cards');
  const dealerFirstCardElement = dealerHandElement.querySelector('img'); // Get the dealer's first card element
  
  if (dealerFirstCardElement) {
    // Reveal the first card of the dealer (this was previously hidden)
    const dealerFirstCard = dealerHand[0];  // The dealer's first card
    const dealerCardValue = getCardValue(dealerFirstCard);  // Get the card's value
    const dealerCardSuit = getCardSuit(dealerFirstCard);  // Get the card's suit
    
    const suitMap = {
      C: 'clubs',
      D: 'diamonds',
      H: 'hearts',
      S: 'spades'
    };

    // Update the image source to show the correct card
    dealerFirstCardElement.src = `../images/cards/${suitMap[dealerCardSuit[0].toUpperCase()]}/${dealerCardValue}${dealerCardSuit[0].toUpperCase()}.png`;
    dealerFirstCardElement.alt = `${dealerCardValue} of ${dealerCardSuit}`;
  }

  let dealerScore = calculateScore(dealerHand);

  // Dealer's logic: draw cards while score is below 17
  while (dealerScore < 17) {
    dealerHand.push(drawCard(deck));
    dealerScore = calculateScore(dealerHand);
  }

   
  determineWinner();  // Determine and show the result
  displayHands();  // Re-display hands to show the dealer's final hand
}

// Function to determine the winner
function determineWinner() {

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);
  const resultElement = document.getElementById('game-result');
  const dealerScoreElement = document.getElementById('dealer-score'); // Get dealer score element

  console.log(`Player Score: ${playerScore}, Dealer Score: ${dealerScore}`);
  
  // Set the dealer's score in the DOM
  dealerScoreElement.textContent = dealerScore;

  if (playerScore > 21) {
    resultElement.textContent = "You busted! Dealer wins!";
    resultElement.style.color = "red";
    playerMoney -= 10; // Deduct money if player busts
  } else if (dealerScore > 21) {
    resultElement.textContent = "Dealer busted! You win!";
    resultElement.style.color = "red";
     playerMoney += 10;//  Add money if dealer busts
  } else if (playerScore > dealerScore) {
    resultElement.textContent = "You win!";
    resultElement.style.color = "red";
     playerMoney += 10; // Add money if player wins here
  } else if (playerScore < dealerScore) {
    resultElement.textContent = "Dealer wins!";
    resultElement.style.color = "red";
     playerMoney -= 10; // Deduct money if dealer wins here
  } else {
    resultElement.textContent = "It's a tie!";
    resultElement.style.color = "orange";
  }
  // Update localStorage with the new player money
  localStorage.setItem('playerMoney', playerMoney);

  // Display updated player money
  document.getElementById('player-money').textContent = `Money: $${playerMoney}`;
  gameOver = true;
}

// Function to reset the game
function resetGame() {
  gameOver = false;
  playerHand = [];
  dealerHand = [];
  document.getElementById('game-result').textContent = ""; // Clear the result
  startBlackjack();
}

export { startBlackjack, hit, stand, resetGame };