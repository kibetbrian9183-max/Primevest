// ===============================
// PRIMEVEST HOME
// ===============================

// Redirect if not logged in
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// Display user information
document.getElementById("welcomeUser").innerHTML =
    "Hi, " + currentUser.username;

document.getElementById("balance").innerHTML =
    "KSh " + currentUser.balance.toLocaleString();

// =====================================
// INVESTMENT PRODUCTS
// =====================================

const products = [

    {
        name: "Starter Plan",
        invest: 500,
        daily: 50,
        duration: 30
    },

    {
        name: "Silver Plan",
        invest: 1000,
        daily: 110,
        duration: 30
    },

    {
        name: "Gold Plan",
        invest: 3000,
        daily: 360,
        duration: 30
    },

    {
        name: "Diamond Plan",
        invest: 5000,
        daily: 650,
        duration: 30
    },

    {
        name: "VIP Plan",
        invest: 10000,
        daily: 1400,
        duration: 30
    }

];

const productList = document.getElementById("productList");

products.forEach(product => {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

        <h3>${product.name}</h3>

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

}        <p><strong>Investment:</strong> KSh ${product.invest}</p>

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
