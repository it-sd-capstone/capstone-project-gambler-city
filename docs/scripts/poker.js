import {shuffleDeck, getCardValue, getCardSuit, dealDeck, drawCard} from './deck.js';

//Initializing Variables
let deck = ['1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C', 
            '1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', '11D', '12D', '13D', 
            '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', '11H', '12H', '13H', 
            '1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S'];
let playerHands = [];
let communityCards = [];
let gameOver = false;
let phaseNum = 1;
let betButton = document.getElementById('bet-button');
let callButton = document.getElementById('call-button');
let foldButton = document.getElementById('fold-button');
let nextPhaseButton = document.getElementById('next-phase-button');
let nextHandButton = document.getElementById('next-hand-button');

//Adding Click Events
document.getElementById('bet-button').addEventListener('click', bet);
document.getElementById('call-button').addEventListener('click', call);
document.getElementById('fold-button').addEventListener('click', fold);
document.getElementById('next-phase-button').addEventListener('click', nextPhase);
document.getElementById('next-hand-button').addEventListener('click', nextHand);
nextPhaseButton.classList.add('inactive');
nextHandButton.classList.add('inactive');

function dealHands(deck, playerHands) {
  shuffleDeck(deck);
  dealDeck(deck, playerHands, 2, 2);
}

function displayHands(playerHands) {
  const playerHandElement = document.getElementById('player-cards');
  const dealerHandElement = document.getElementById('dealer-cards');
  const pokerHandElement = document.getElementById('poker-cards');
  
  // Clear current displayed hands
  playerHandElement.innerHTML = '';
  dealerHandElement.innerHTML = '';
  pokerHandElement.innerHTML = '';
  
  // Display player/dealer hands
    for(let i = 0; i < playerHands.length; i++) {
      for(let j = 0; j < playerHands[0].length; j++) {
        let isFaceDown = false;
        if(i > 0 && !gameOver) {
          isFaceDown = true;
          const cardElement = createCardElement(playerHands[i][j], isFaceDown); 
          dealerHandElement.appendChild(cardElement);
        } else if (i > 0 && gameOver) {
          const cardElement = createCardElement(playerHands[i][j], isFaceDown); 
          dealerHandElement.appendChild(cardElement);
        } else 
        {
          const cardElement = createCardElement(playerHands[i][j], isFaceDown); 
          playerHandElement.appendChild(cardElement);
        }
      }
    }
  // Display Community Card Hand (Flop, Turn, River) 
    for(let i = 0; i < communityCards.length; i++) {
      const cardElement = createCardElement(communityCards[i], false);
      pokerHandElement.appendChild(cardElement);
    }

  }
  
  //Function to show card image
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
  
    // Set the image source and alt text
    cardImg.src = cardImgSrc;
    cardImg.alt = isFaceDown ? 'Card Back' : `${cardValue} of ${cardSuit}`;
    cardImg.className = 'card-image';
  
    return cardImg;
  }

  /* Poker specific methods, bet, call, fold, nextPhase, nextHand, calculateScore.
    All methods will set buttons to inactive at the correct phases of the game.
    nextPhase will check which phase it is and play amount of cards accordingly.
    nextHand will put the deck all 52 cards together and all hands are empty.
    calculate score will look for certain patterns to see who wins. */
    

  //WIP
  function bet() {
    nextPhaseButton.classList.remove('inactive');
  }

  //WIP
  function call() {
    nextPhaseButton.classList.remove('inactive');
  }

  function fold() {
    gameOver = true;
    displayHands(playerHands);
    betButton.classList.add("inactive");
    callButton.classList.add("inactive");
    foldButton.classList.add("inactive");
    nextHandButton.classList.remove("inactive");
    calculateScore();
  }
  
  function nextPhase() {
    if(!gameOver && phaseNum == 1) {
      for(let i = 0; i < 3; i++) {
        let card = drawCard(deck);
        communityCards.push(card);
        displayHands(playerHands);
        nextPhaseButton.classList.add('inactive');
      }
      phaseNum++;
    } else if(!gameOver && phaseNum == 2) {
      let card = drawCard(deck);
        communityCards.push(card);
        displayHands(playerHands);
        phaseNum++;
        nextPhaseButton.classList.add('inactive');
    } else if(!gameOver && phaseNum == 3) {
      let card = drawCard(deck);
        communityCards.push(card);
        displayHands(playerHands);
        phaseNum++;
        betButton.classList.add("inactive");
        callButton.classList.add("inactive");
        foldButton.classList.add("inactive");
        nextPhaseButton.classList.add('inactive');
        nextHandButton.classList.remove('inactive');
        gameOver = true;
        displayHands(playerHands);
        calculateScore();
     } 
  }

  function nextHand() {
    if(gameOver) {
      for(let i = 0; i < playerHands.length; i++) {
        for(let j = 0; j < playerHands[0].length; j++) {
          if(getCardValue(playerHands[i][j]) == 14) {
            playerHands[i][j] = 1 + getCardSuit(playerHands[i][j]);
          }
          deck.push(playerHands[i][j]);
        }
      }
      for (let i = 0; i < communityCards.length; i++) {
        if(getCardValue(communityCards[i]) == 14) {
          communityCards[i] = 1 + getCardSuit(communityCards[i]);
        }
        deck.push(communityCards[i]);
      }
      gameOver = false;
      phaseNum = 1;
      playerHands=[];
      communityCards=[];
      shuffleDeck(deck);
      dealHands(deck, playerHands);
      displayHands(playerHands);
      betButton.classList.remove("inactive");
      callButton.classList.remove("inactive");
      foldButton.classList.remove("inactive");
      nextPhaseButton.classList.add("inactive");
      nextHandButton.classList.add("inactive");
    }
  }
  
  //WIP
  function calculateScore() {
    console.clear();
    let highestScore = 0;

    for(let i = 0; i < 2; i++) {
      //These reset the highscore after switching to another hand
      let pairCount = 0;
      let twoPair = false;
      let threeOfAKind = false;
      let fullHouse = false;
      let fourOfAKind = false;
      let straight = false;
      let flush = false;
      let straightFlush = false;

      //Adds cards to array, orders them low to high, then check if previous number is 1 lower than current
      let straightArray = [];
      let playerCommunityArray = [];
      let straightCardCount = 1;
      straightArray.push(getCardValue(playerHands[i][0]));
      straightArray.push(getCardValue(playerHands[i][1]));
      playerCommunityArray.push(playerHands[i][0]);
      playerCommunityArray.push(playerHands[i][1]);
      for(let j = 0; j < 5; j++) {
        straightArray.push(getCardValue(communityCards[j]));
        playerCommunityArray.push(communityCards[j]);
      }
      //If there is an ace, push a 14 value because ace can be used as a high in straights
      if(straightArray.includes(1)) {
        straightArray.push(14);
      } else if (straightArray.includes(14)) {
        straightArray.push(1);
      }

      //Sorts arrays by numbers to check for straights
      straightArray.sort(function(num1, num2) {
        return num1- num2;      
      })
      playerCommunityArray.sort(function(a, b) {
        const num1 = parseInt(a);
        const num2 = parseInt(b);
        if (num1 && num2) {
          return num1 - num2;
        } else if (num1) {
          return -1;
        } else if (num2) {
          return 1;
        } else {
          return a.localeCompare(b);
        }
      });
      let straightFlushArray = playerCommunityArray.map(function(card) {
        return card.slice(-1);
      });
      for(let j = 0; j < straightArray.length; j++) {
        if(straightArray[j - 1] !== -1 && straightArray[j] == straightArray[j - 1] + 1) {
          straightCardCount++;
          if(straightCardCount > 4) {
            console.log("Straight!");
            straight = true;
          } 
        } else {
          straightCardCount = 1;
        }
      }

      /*
        Checks if there are flushes,
        both arrays are ordered low to high by number,
        then a counter keeps track of how many of each suit for a flush,
        then another counter keeps track of how many suits in a row for straight flushes
      */
      let flushArray = [];
      let clubsCount = 0;
      let diamondsCount = 0;
      let heartsCount = 0;
      let spadesCount = 0;
      let suitCount = 0;
      
      flushArray.push(getCardSuit(playerHands[i][0]));
      flushArray.push(getCardSuit(playerHands[i][1]));
      for(let j = 0; j < 5; j++) {
        flushArray.push(getCardSuit(communityCards[j]));
      }
      for(let j = 0; j < flushArray.length; j++) {
        if(straightFlushArray[j] === (straightFlushArray[j - 1])) {
          suitCount++;
          if(suitCount > 3) {
            straightFlush = true;
            console.log("Straight Flush!");
          }
        } else {
          suitCount = 0;
        } 
        if (flushArray[j] == 'C') {
          clubsCount++;
        } else if (flushArray[j] == 'D') {
          diamondsCount++;
        } else if (flushArray[j] == 'H') {
          heartsCount++;
        } else if (flushArray[j] == 'S') {
          spadesCount++;
        }
      }

      if(clubsCount > 4) {
        flush = true;
        console.log("Clubs Flush!");
      } else if (diamondsCount > 4) {
        flush = true;
        console.log("Diamond Flush!")
      } else if (diamondsCount > 4) {
        flush = true;
        console.log("Diamond Flush!")
      } else if (diamondsCount > 4) {
        flush = true;
        console.log("Diamond Flush!")
      }


      for(let j = 0; j < 2; j++) {
        let duplicates = 0;

        //Converts Aces because Ace is high in Texas Holdem
        if(getCardValue(playerHands[i][j]) == 1) {
          playerHands[i][j] = 14 + getCardSuit(playerHands[i][j]);
        }

        //Highest Card Value is High Score
        if(getCardValue(playerHands[i][j]) > highestScore) {
          highestScore = getCardValue(playerHands[i][j]);
        } 

        //Checks for pairs in player hand
        if(playerHands[i][j+1] !== undefined) {
          if(getCardValue(playerHands[i][j]) == getCardValue(playerHands[i][j+1])) {
            duplicates += 1; 
            console.log("Player has duplicates! " + duplicates);
          }
        } else if (playerHands[i][j-1] !== undefined) {
          if(getCardValue(playerHands[i][j]) == getCardValue(playerHands[i][j-1])) {
            duplicates += 1; 
            console.log("Player has duplicates! " + duplicates);
          }
        }

        //Goes through community cards to compare with player's hands
        for(let k = 0; k < 5; k++) {
          if(communityCards[k] !== undefined) {

            //Converts Community Aces
            if(getCardValue(communityCards[k]) == 1) {
              communityCards[k] = 14 + getCardSuit(communityCards[k]);
            }

            //Checks for pairs with community cards
            if(getCardValue(playerHands[i][j]) == getCardValue(communityCards[k])) {
              duplicates += 1;
              pairCount += 1;
              console.log(duplicates + " Community Duplicates");
            }

            //Checks duplicates and pairs to set hand rank to true
            if(duplicates == 3) {
              fourOfAKind = true;
              console.log("Four of a kind! " + pairCount);
            } else if (duplicates == 2 && pairCount == 2) {
              fullHouse = true;
              console.log("Full House! " + pairCount);
            }
              else if(duplicates == 2) {
              threeOfAKind = true;
              console.log("Three of a kind! " + pairCount);
            } else if (pairCount == 2) {
              twoPair = true;
              console.log("Two Pair! " + pairCount);
            }
            
            }
          } // End Community Card Loop
          if(straightFlush) {
            highestScore = 22;
          } else if (fourOfAKind) {
            highestScore = 21;
          } else if (fullHouse) {
            highestScore = 20;
          } else if (flush) {
            highestScore = 19;
          } else if (straight) {
            highestScore = 18;
          } else if (threeOfAKind) {
            highestScore = 17;
          } else if(twoPair) {
            highestScore = 16;
          } else if(duplicates == 1) {
            highestScore = 15;
          } 
        
        console.log(playerHands[i][j]);
        console.log(highestScore);
      } // End Player Card Loop
    } // End Player Hand Loop
  }
  dealHands(deck, playerHands);
  displayHands(playerHands);
