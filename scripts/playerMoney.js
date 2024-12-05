// playerMoney.js
function setPlayerMoney(bank) {
  localStorage.setItem('playerMoney', bank);
}

function getPlayerMoney() {
  let bank = parseInt(localStorage.getItem('playerMoney'), 10);
  return isNaN(bank) ? 100 : bank; // Default to $100 if no valid money is found
}