// Import .js
import { printDeck, printDeckValues, getCardValue, getCardSuit, shuffleDeck, dealDeck, createDeck} from './deck.js';
import { calculateScore, hit, resetGame, checkWinner } from './blackjackTest.js';


let playerHands = [];
let deck = ['1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C',
        '1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', '11D', '12D', '13D',
        '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', '11H', '12H', '13H',
        '1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S']
printDeck(deck);
printDeckValues(deck);
console.log(getCardValue('3S'));
console.log(getCardSuit('3S'));
console.log(shuffleDeck(deck));
dealDeck(deck, playerHands, 3, 3);
console.log(deck);
console.log(playerHands);

// blackjack.test.js
import assert from 'assert';

// Test for calculateScore
(function testCalculateScore() {
        let hand = ['10C', '7D'];
        try {
                assert.strictEqual(calculateScore(hand), 17, 'Expected score to be 17');
                console.log('testCalculateScore passed');
        } catch (e) {
                console.error('testCalculateScore failed: ' + e.message);
        }

        hand = ['1C', '7D'];
        try {
                assert.strictEqual(calculateScore(hand), 18, 'Expected score to be 18 (Ace as 11)');
                console.log('testCalculateScore passed');
        } catch (e) {
                console.error('testCalculateScore failed: ' + e.message);
        }

        hand = ['1C', '10D', '1H'];
        try {
                assert.strictEqual(calculateScore(hand), 12, 'Expected score to be 12 (Ace as 1)');
                console.log('testCalculateScore passed');
        } catch (e) {
                console.error('testCalculateScore failed: ' + e.message);
        }
        })();

        // Test for hit
        (function testHit() {
        let playerHand = ['1C', '7D'];
        const newCard = '5H';
        try {
                const updatedHand = hit(playerHand, newCard);
                assert.strictEqual(updatedHand.length, 3, 'Expected hand length to be 3');
                assert(updatedHand.includes(newCard), 'Expected hand to include the new card');
                console.log('testHit passed');
        } catch (e) {
                console.error('testHit failed: ' + e.message);
        }
        })();

        // Test for resetGame
        (function testResetGame() {
        try {
                const gameState = resetGame();
                assert.deepStrictEqual(gameState.playerHand, [], 'Expected player hand to be empty');
                assert.deepStrictEqual(gameState.dealerHand, [], 'Expected dealer hand to be empty');
                assert.strictEqual(gameState.gameOver, false, 'Expected gameOver to be false');
                assert.strictEqual(gameState.winner, null, 'Expected winner to be null');
                console.log('testResetGame passed');
        } catch (e) {
                console.error('testResetGame failed: ' + e.message);
        }
        })();

        // Test for checkWinner
        (function testCheckWinner() {
        let playerHand = ['10C', '7D']; // 17
        let dealerHand = ['9H', '7S']; // 16
        try {
                assert.strictEqual(checkWinner(playerHand, dealerHand), 'player', 'Expected player to win');
                console.log('testCheckWinner (1) passed');
        } catch (e) {
                console.error('testCheckWinner (1) failed: ' + e.message);
        }

        playerHand = ['10C', '7D']; // 17
        dealerHand = ['10H', '9S']; // 19
        try {
                assert.strictEqual(checkWinner(playerHand, dealerHand), 'dealer', 'Expected dealer to win');
                console.log('testCheckWinner (2) passed');
        } catch (e) {
                console.error('testCheckWinner (2) failed: ' + e.message);
        }

        playerHand = ['10C', '7D']; // 17
        dealerHand = ['7H', '10S']; // 17
        try {
                assert.strictEqual(checkWinner(playerHand, dealerHand), 'draw', 'Expected a draw');
                console.log('testCheckWinner (3) passed');
        } catch (e) {
                console.error('testCheckWinner (3) failed: ' + e.message);
        }
        })();