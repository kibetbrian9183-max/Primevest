// ===============================
// PRIMEVEST HOME
// ===============================

const API_BASE_URL = "https://fuliza-backend-xgsm.onrender.com";

// localStorage here is session context only (which user is logged in on
// this device) — the balance itself now comes from the database.
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || !currentUser.phone) {
    window.location.href = "index.html";
}

const welcomeUser = document.getElementById("welcomeUser");
const balanceEl = document.getElementById("balance");
const receiveBtn = document.getElementById("receiveBtn");
const rechargeBtn = document.getElementById("rechargeBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

welcomeUser.innerHTML = "Welcome, " + (currentUser.name || currentUser.phone);

// ===============================
// LOAD REAL BALANCE FROM THE DATABASE
// ===============================

async function loadBalance() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/user/${currentUser.phone}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch user balance");
        }

        const user = await response.json();

        balanceEl.innerHTML = "KSh " + Number(user.balance || 0).toLocaleString();

        // Keep a light local cache for instant display on next page load,
        // but this is a cache, not the source of truth.
        localStorage.setItem("cachedBalance", JSON.stringify(user));

    } catch (error) {
        console.log(error);

        // Fall back to last known cached value if the request fails,
        // rather than showing nothing.
        const cached = JSON.parse(localStorage.getItem("cachedBalance"));
        if (cached) {
            balanceEl.innerHTML = "KSh " + Number(cached.balance || 0).toLocaleString();
        }
    }
}

loadBalance();

// ===============================
// NAV BUTTONS
// ===============================

receiveBtn.addEventListener("click", () => {
    window.location.href = "receive.html";
});

rechargeBtn.addEventListener("click", () => {
    window.location.href = "recharge.html";
});

withdrawBtn.addEventListener("click", () => {
    window.location.href = "withdraw.html";
});
        <p><strong>Investment:</strong> KSh ${product.invest}</p>

        <p><strong>Daily Income:</strong> KSh ${product.daily}</p>

        <p><strong>Duration:</strong> ${product.duration} Days</p>

        <button>Purchase</button>

    `;

    card.querySelector("button").onclick = function(){

        localStorage.setItem(
            "selectedProduct",
            JSON.stringify(product)
        );

        window.location.href = "payment.html";

    };

    productList.appendChild(card);

});

// =====================================
// WALLET BUTTONS
// =====================================

document.getElementById("receiveBtn").onclick = function(){

    window.location.href = "receive.html";

};

document.getElementById("rechargeBtn").onclick = function(){

    window.location.href = "recharge.html";

};

document.getElementById("withdrawBtn").onclick = function(){

    window.location.href = "withdraw.html";

};

// =====================================
// LIVE ACTIVITY
// =====================================

const names = [

    "Brian O.",
    "James K.",
    "Mercy W.",
    "Faith N.",
    "Kevin M.",
    "John O.",
    "Peter K.",
    "Grace A.",
    "Dennis T.",
    "Susan C."

];

const amounts = [

    500,
    1000,
    3000,
    5000,
    10000

];

function randomPhone(){

    const prefix = [

        "071",
        "072",
        "074",
        "075",
        "076",
        "079",
        "011"

    ];

    const p = prefix[Math.floor(Math.random()*prefix.length)];

    const a = Math.floor(Math.random()*900)+100;

    const b = Math.floor(Math.random()*900)+100;

    return `${p}${a}***${b}`;

}

function showActivity(){

    const name =
        names[Math.floor(Math.random()*names.length)];

    const amount =
        amounts[Math.floor(Math.random()*amounts.length)];

    document.getElementById("activityText").innerHTML =

        `${name} (${randomPhone()}) invested KSh ${amount}`;

}

showActivity();

setInterval(showActivity,7000);

// =====================================
// COPY REFERRAL LINK
// =====================================

function copyReferral(){

    const link =
    window.location.origin +
    "/register.html?ref=" +
    currentUser.referralCode;

    navigator.clipboard.writeText(link);

    alert("Referral link copied!");

}
