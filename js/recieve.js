// ===============================
// PRIMEVEST RECEIVE EARNINGS
// ===============================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

const earningAmount = document.getElementById("earningAmount");
const countdown = document.getElementById("countdown");
const claimBtn = document.getElementById("claimBtn");
const historyList = document.getElementById("historyList");

// ===============================
// CALCULATE DAILY EARNING
// ===============================

let todayEarning = 0;

if (currentUser.products) {

    currentUser.products.forEach(product => {

        todayEarning += Number(product.daily);

    });

}

earningAmount.innerHTML =
    "KSh " + todayEarning.toLocaleString();

// ===============================
// CHECK 24 HOURS
// ===============================

let lastClaim = currentUser.lastClaimTime || 0;

function checkClaimTime() {

    const now = Date.now();

    const nextClaim = lastClaim + (24 * 60 * 60 * 1000);

    if (now >= nextClaim) {

        countdown.innerHTML = "Ready to Claim";

        claimBtn.disabled = false;

    } else {

        const remaining = nextClaim - now;

        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);

        countdown.innerHTML =
            `Next claim in ${hours}h ${minutes}m`;

        claimBtn.disabled = true;

    }

}

checkClaimTime();

setInterval(checkClaimTime, 60000);

// ===============================
// CLAIM EARNINGS
// ===============================

claimBtn.onclick = function () {

    if (todayEarning <= 0) {

        alert("You have no active investment.");

        return;

    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        user => user.phone === currentUser.phone
    );

    if (index === -1) return;

    users[index].balance += todayEarning;

    users[index].totalEarnings += todayEarning;

    users[index].lastClaimTime = Date.now();

    if (!users[index].earningsHistory) {

        users[index].earningsHistory = [];

    }

    users[index].earningsHistory.unshift({

        amount: todayEarning,

        date: new Date().toLocaleString()

    });

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem(
        "currentUser",
        JSON.stringify(users[index])
    );

    currentUser = users[index];

    alert("Daily earnings received successfully.");

    location.reload();

};

// ===============================
// EARNINGS HISTORY
// ===============================

historyList.innerHTML = "";

if (
    currentUser.earningsHistory &&
    currentUser.earningsHistory.length > 0
) {

    currentUser.earningsHistory.forEach(item => {

        historyList.innerHTML += `

        <div class="history-item">

            <h3>+ KSh ${item.amount.toLocaleString()}</h3>

            <p>${item.date}</p>

        </div>

        `;

    });

} else {

    historyList.innerHTML =
        "<p>No earnings claimed yet.</p>";

}
