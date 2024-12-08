
// -----------------------------------cards -- logic

let matchCards = [];
let deck = [];


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

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }


deck = createDeck();

function getCardValue(card) {
    return parseInt(card.substring(0, card.length - 1));
  }
  
  function getCardSuit(card) {
    return card[card.length - 1];
  }

function getRandomElements(arr, numElements) {
    // Shuffle the array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    
    // Return the first numElements elements
    return arr.slice(0, numElements);
  }
  
  
  const randomElements = getRandomElements(deck, 6);
  
  console.log(randomElements);

  const suitMap = {
    C: 'clubs',
    D: 'diamonds',
    H: 'hearts',
    S: 'spades'
  };


// -----------------------------------document -- logic

const docBody = document.querySelector('body');


const gameSection = document.querySelector('.memory-game');



// -----------------------------------card graphic logic

for (let i = 0; i < 2; i++) {
for (let i = 0;  i < 6; i++ ){

const matchCard = randomElements[i];
const cardValue = getCardValue(matchCard);
const cardSuit = getCardSuit(matchCard); 


  
  let cardElement = `./images/cards/${suitMap[cardSuit[0]]}/${cardValue}${cardSuit[0]}.png`;



    const memoryCard = document.createElement('div');    
    memoryCard.className = 'memory-card';
    gameSection.appendChild(memoryCard);
    memoryCard.setAttribute('data-framework', randomElements[i]);

     const frontFace = document.createElement('img');
     frontFace.className ='front-face';
     frontFace.src = cardElement;
     memoryCard.appendChild(frontFace);
    
     const backFace = document.createElement('img');
     backFace.className = 'back-face';
     backFace.src = `./images/cards/cardbacks.png`;
     memoryCard.appendChild(backFace);

     // -----------------------------------css 


     const cardStyle = document.createElement('style');
     cardStyle.textContent = `

     * {
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
    }   

    body {
        height: 100vh !important;
        display: flex !important;
        background-color: rgb(22, 59, 22) !important;
    }

    .top {
      background-color: rgba(22, 59, 22)!important;
      width: 100vw;
      text-align:center;      
    }

    .wrapper{
      margin: auto
      background-color: rgb(22, 59, 22) !important;
      width: 100vw;
      height: 100vh;
    
    }

    .memory-game {
        width: 70vw;
        height: 70vw;
        max-width: 640px;
        max-height: 640px;
        margin: auto;
        display: flex;
        flex-wrap: wrap;
        perspective: 1000px;
        background-color: rgba(22, 59, 22)!important; 
        
    }


     .memory-card {
        width: calc(25% - 2vw);
        height: calc(33% - 2vw);
        position: relative;
        margin: 1vw 1vw;
        transform: scale(1);
        transform-style: preserve-3d;
        transition: transform .5s;
    }
    
    .memory-card:active {
        transform: scale(.97);
        transition: transform .2s;
    }
    
    .memory-card.flip {
        transform: rotateY(180deg);
    }
    

     .front-face, .back-face {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: ;
        backface-visibility: hidden;
    }
    
    .front-face {
        transform:rotateY(180deg);
    }

      .btn {
        padding: 3rem 4rem;
        font-size: 2rem;
        background-color: #326341;
        color: white;
        border-style: double;
        border-radius: 5px;
        border: 2px solid white;
        cursor: pointer;
        width: auto;
        position: relative;
    }
    `;


    document.head.appendChild(cardStyle);

    }
}


// -----------------------------------card flipping logic




const cards = document.querySelectorAll('.memory-card');


let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let coinsEarned = 0;

function flipCard(){
    if(lockBoard) return;
    if(this === firstCard) return;
    this.classList.toggle('flip');

    if (!hasFlippedCard) {
        //first click
        hasFlippedCard = true;
        firstCard = this;
        return;
    } 
        //second click
        hasFlippedCard = false;
        secondCard = this;

        checkForMatch();
}   

function checkForMatch(){
    if(firstCard.dataset.framework === secondCard.dataset.framework){
        disableCards();
        increaseScore();
    } else {
        unflipCards();
    }
}

function disableCards(){
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards(){
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
       }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];

}

function increaseScore() {
 score++;
 document.querySelector(".currentScore").textContent = score;
}

// function payOut() {
//     coinsEarned += score;
//     document.querySelector(".currentEarned").textContent = coinsEarned;
//     score = 0;
//     document.querySelector(".currentScore").textContent = score;

// } 
function payOut() {
  // Get the current player money from local storage or set to 0
  let playerMoney = localStorage.getItem('playerMoney') || 0;

  // Debugging log: Check the value of playerMoney from localStorage
  console.log('Player Money (before parsing):', playerMoney);

  // Ensure playerMoney is a number (parse it correctly)
  playerMoney = parseInt(playerMoney, 10); // Explicitly parse as integer

  // Debugging log: Check parsed playerMoney
  console.log('Parsed Player Money:', playerMoney);

  // Add score to the player money
  playerMoney += score;

  // Save the updated player money back to local storage
  localStorage.setItem('playerMoney', playerMoney);

  // Update the UI to show the new player money
  document.querySelector(".currentEarned").textContent = playerMoney;

  // Reset the score
  score = 0;
  document.querySelector(".currentScore").textContent = score;
}

function restart(){
    score = 0;
    document.querySelector(".currentScore").textContent = score;
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    shuffle();
    resetBoard();
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

shuffle();
cards.forEach(card => card.addEventListener('click', flipCard))
