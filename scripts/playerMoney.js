// playerMoney.js
export function setPlayerMoney(bank) {
  localStorage.setItem('playerMoney', bank);
}

export function getPlayerMoney() {
  let bank = parseInt(localStorage.getItem('playerMoney'), 10);
  return isNaN(bank) ? 100 : bank; // Default to $100 if no valid money is found
}