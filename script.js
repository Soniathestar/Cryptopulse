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

let chart; 

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const coin = searchInput.value.toLowerCase();

    if (!coin) return;

    try {
        // 1. Get coin data
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coin}`
        );
        const data = await response.json();

        const price = data.market_data.current_price.usd;
        const change = data.market_data.price_change_percentage_24h;

        nameEl.textContent = data.name;
        priceEl.textContent = `Price: $${price}`;
        changeEl.textContent = `24h Change: ${change.toFixed(2)}%`;

        const chartRes = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`
        );
        const chartData = await chartRes.json();

        const prices = chartData.prices.map(p => p[1]);
        const labels = chartData.prices.map(p => {
            const date = new Date(p[0]);
            return date.toLocaleDateString();
        });

        renderChart(labels, prices, data.name);

    } catch (error) {
        alert("Crypto not found. Try: bitcoin, ethereum, solana");
    }
});

function renderChart(labels, data, label) {
    const ctx = document.getElementById("chart").getContext("2d");

    // destroy old chart before creating new one
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: `${label} Price (USD)`,
                data: data,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.1)",
                tension: 0.3
            }]
        },
        options: {
            responsive: true
        }
    });
}

const coinId = "bitcoin";
const vsCurrency = "usd";

// ===== STATE =====
let currentPrice = 0;
let alertPrice = null;

// ===== DOM =====
const alertInput = document.getElementById("alertvalue");
const setAlertBtn = document.getElementById("setalert");
const statusText = document.getElementById("alertstatus");

// ===== SET ALERT =====
setAlertBtn.addEventListener("click", () => {
    const value = parseFloat(alertInput.value);

    if (isNaN(value) || value <= 0) {
        statusText.textContent = "Enter a valid price";
        return;
    }

    alertPrice = value;
    statusText.textContent = `Alert set: notify when ${coinId} < ${alertPrice}`;
});

async function fetchPrice() {
    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${vsCurrency}`;

        const res = await fetch(url);
        const data = await res.json();

        currentPrice = data[coinId][vsCurrency];

        console.log("Current price:", currentPrice);

        checkAlert();
    } catch (error) {
        console.error("Error fetching price:", error);
        statusText.textContent = "Error fetching price data";
    }
}

function checkAlert() {
    if (alertPrice !== null && currentPrice <= alertPrice) {
        statusText.textContent = `🚨 ALERT! ${coinId} is now ${currentPrice}`;

        alert(`Price Alert: ${coinId} dropped to ${currentPrice}`);
        alertPrice = null;
    }
}


fetchPrice(); 
setInterval(fetchPrice, 15000); 