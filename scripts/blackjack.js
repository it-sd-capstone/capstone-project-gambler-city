import { shuffleDeck, getCardValue, getCardSuit, createDeck, drawCard } from './deck.js';
import { getPlayerMoney, setPlayerMoney } from './playerMoney.js';

// Initialize player money
let playerMoney = getPlayerMoney();

const suits = ["C", "D", "H", "S"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let currentBet = 0; 

// Function to start a new game of Blackjack
function startBlackjack() {
  let betAmount;

  // Retrieve the current money
  playerMoney = getPlayerMoney();
  console.log(playerMoney);
  document.getElementById('player-money').textContent = `Money: $${playerMoney}`;
  setPlayerMoney(playerMoney);

  // Check if player has enough money to place the minimum bet ($5)
  if (playerMoney < 5) {
    alert("You do not have enough money to place the minimum bet of $5. Play our Match Game to earn more money!");
    return; // Exit the function early, preventing the game from starting
  }

  do {
    betAmount = prompt(`Place your bet please\n $5 Min\n You have $${playerMoney}.`);

    // Validate bet
    if (betAmount === null) { // User canceled the prompt
      alert("Betting is required to start the game.");
      continue;
    } else if (isNaN(betAmount) || betAmount < 5 || betAmount > 100 || betAmount > playerMoney) {
      alert(`Invalid bet. Please enter a number between $5 and $${Math.min(100, playerMoney)}.`);
    }
  } while (betAmount === null || isNaN(betAmount) || betAmount < 5 || betAmount > 100 || betAmount > playerMoney);

  // Deduct the bet from the player's money
  currentBet = parseInt(betAmount, 10);
  playerMoney -= currentBet;
  setPlayerMoney(playerMoney);
  localStorage.setItem('playerMoney', playerMoney); // Save updated money
  document.getElementById('player-money').textContent = `Money: $${playerMoney}`; 

  // Proceed with game
  deck = createDeck(); 
  shuffleDeck(deck);

  // Deal initial cards
  playerHand = [drawCard(deck), drawCard(deck)];
  dealerHand = [drawCard(deck), drawCard(deck)];

  displayHands(); // Display the hands after dealing
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

  // Display dealer hand (only show one card if the game is ongoing)
  //console.log("Displaying dealer's hand:", dealerHand);
  dealerHand.forEach((card, index) => {
    const isFaceDown = index === 0 && !gameOver;
    const cardElement = createCardElement(card, isFaceDown); 
    //cardElement.textContent = `${getCardValue(card)} of ${getCardSuit(card)}`; CARD AS TEXT
    dealerHandElement.appendChild(cardElement);
    //console.log(`Card: ${card}, FaceDown: ${isFaceDown}`);
  });
  // Update player score 
  const playerScore = calculateScore(playerHand);
  playerScoreElement.textContent = `Score: ${playerScore}`;
  
  // Dealer score
  if (!gameOver) {
    dealerScoreElement.textContent = "Score: ???";
  } else {
    const dealerScore = calculateScore(dealerHand);
    dealerScoreElement.textContent = `Score: ${dealerScore}`;
  }// console.log("Displaying dealer's hand:", dealerHand);
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
  ? './images/cards/cardbacks.png'
  : `./images/cards/${suitMap[suitInitial]}/${cardValue}${suitInitial}.png`;
  //console.log("Image Path:", cardImgSrc);

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
    //console.log(`Card: ${card}, Card Value: ${cardValue}`);

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
  //console.log(`Player Score after hit: ${calculateScore(playerHand)}`);
  
  if (calculateScore(playerHand) > 21) {
    gameOver = true;  // End the game if player busts
    displayHands();  // Re-display hands to show the bust
    determineWinner();  // Determine and show the result
  }
}

// Function to handle "Stand"
function stand() {
  if (gameOver) return;
    //console.log("Stand Function Reached..");

    // Reveal the dealer's first card
    const dealerHandElement = document.getElementById('dealer-cards');
    const dealerFirstCardElement = dealerHandElement.querySelector('img'); // Get the dealer's first card element
    
    if (dealerFirstCardElement) {
      dealerFirstCardElement.classList.add('flip'); // Add flip class to animate
      setTimeout(() => {
      const dealerFirstCard = dealerHand[0];  // Dealer's first card
      const dealerCardValue = getCardValue(dealerFirstCard);
      const dealerCardSuit = getCardSuit(dealerFirstCard);
      
      const suitMap = {
        C: 'clubs',
        D: 'diamonds',
        H: 'hearts',
        S: 'spades'
      };

      // Update the image source to show card
      dealerFirstCardElement.src = `./images/cards/${suitMap[dealerCardSuit[0].toUpperCase()]}/${dealerCardValue}${dealerCardSuit[0].toUpperCase()}.png`;
      dealerFirstCardElement.alt = `${dealerCardValue} of ${dealerCardSuit}`;

      let dealerScore = calculateScore(dealerHand);

      // Dealer's logic: draw cards while score is below 17
      while (dealerScore < 17) {
        dealerHand.push(drawCard(deck));
        dealerScore = calculateScore(dealerHand);
      }   
      determineWinner();  // Determine and show the result
      displayHands();  // Re-display hands to show the dealer's final hand
    }, 250);
  }
}

// Function to determine the winner
function determineWinner() {

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);
  const resultElement = document.getElementById('game-result');
  const dealerScoreElement = document.getElementById('dealer-score'); // Get dealer score element
  console.log(`Player Score: ${playerScore}, Dealer Score: ${dealerScore}`);
  
  // Set the dealer score in the DOM
  dealerScoreElement.textContent = `Score: ${dealerScore}`;

  if (playerScore > 21) {
    resultElement.textContent = "You busted! Dealer wins!";
    resultElement.style.color = "yellow"; // Player loses
    console.log(`Player Busts - currentBet: ${currentBet}, playerMoney: ${playerMoney}`);
  } else if (dealerScore > 21) {
      resultElement.textContent = "Dealer busted! You win!";
      resultElement.style.color = "yellow";
      playerMoney += currentBet * 2; // Player wins
      console.log(`Dealer Busts - currentBet: ${currentBet}, playerMoney: ${playerMoney}`);
  } else if (playerScore > dealerScore) {
      resultElement.textContent = "You win!";
      resultElement.style.color = "yellow";
      playerMoney += currentBet * 2; // Player wins
      console.log(`Player Wins - currentBet: ${currentBet}, playerMoney: ${playerMoney}`);
  } else if (playerScore < dealerScore) {
      resultElement.textContent = "Dealer wins!";
      resultElement.style.color = "yellow"; // Player loses
      console.log(`Dealer Wins - currentBet: ${currentBet}, playerMoney: ${playerMoney}`);
  } else {
      resultElement.textContent = "It's a tie!";
      resultElement.style.color = "yellow";
      playerMoney += currentBet * 1; // Tie, return the player's bet
      console.log(`It's a Tie - currentBet: ${currentBet}, playerMoney: ${playerMoney}`);
  }
  setPlayerMoney(playerMoney);
  localStorage.setItem('playerMoney', playerMoney);
  document.getElementById('player-money').textContent = `Money: $${playerMoney}`; 

  gameOver = true;
  disableActions();
    
  setTimeout(() => {
    const playAgain = confirm("Would you like to play another hand?");
    if (playAgain) {
      resetGame();
    } else {
      alert("Thank you for playing! Come back soon.");
    }
  }, 3000); //3 second delay for PlayAgain?
}

function disableActions() {
  // Disable Hit and Stand buttons
  document.getElementById('hit-button').disabled = true;
  document.getElementById('stand-button').disabled = true;
}

// Function to reset the game
function resetGame() {
  gameOver = false;
  playerHand = [];
  dealerHand = [];
  document.getElementById('hit-button').disabled = false;
  document.getElementById('stand-button').disabled = false;
  document.getElementById('game-result').textContent = ""; // Clear result
  playerMoney = getPlayerMoney(); // Get the money from localStorage
  setPlayerMoney(playerMoney);

  // Check if the player has enough money to place the minimum bet
  if (playerMoney < 5) {
    alert("You do not have enough money to place the minimum bet of $5. Play our Match Game to earn more money!");
    disableActions();
  } else {
    startBlackjack(); // Start a new game if they have enough money
  }
}

export { startBlackjack, drawCard, hit, stand, resetGame, calculateScore };
