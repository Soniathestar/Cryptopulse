//DOM manipulation
const convertBtn = document.getElementById("converter");
const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("popcurrencies");
const resultEl = document.getElementById("results");
const searchInputCoin = document.getElementById("searchtext");

// Validating user input
convertBtn.addEventListener("click", async  () => {
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;
    const coin = searchInputCoin.value.toLowerCase();

    if (isNaN(amount) || coin.trim() === "") {
    resultEl.textContent = "Enter a valid amount and crypto name first.";
    return;
     }