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
     //Fetching data from the coinGecko API
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
        );
        const data = await res.json();

        if (!data[coin]) {
            resultEl.textContent = "Invalid crypto name.";
            return;
        }
       }
    //Conversion of price
        const price = data[coin][currency];
        const total = amount * price;

        resultEl.textContent = `${amount} ${coin.toUpperCase()} = ${total.toFixed(2)} ${currency.toUpperCase()}`;

     catch (error) {
        resultEl.textContent = "Conversion failed. Try again.";
    }
});  

const form = document.getElementById("searchform");
const searchInput = document.getElementById("searchtext");
const nameEl = document.getElementById("cryptoname");
const priceEl = document.getElementById("cryptoprice");
const changeEl = document.getElementById("cyptochange");
