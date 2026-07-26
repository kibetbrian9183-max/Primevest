// ===============================
// PRIMEVEST RECEIVE EARNINGS
// ===============================

const API_BASE_URL = "https://fuliza-backend-xgsm.onrender.com";

// localStorage is session context only (which phone this device is logged
// in as) — earnings amounts, claim eligibility, and history are all
// computed and enforced server-side now.
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || !currentUser.phone) {
    window.location.href = "index.html";
}

const earningAmount = document.getElementById("earningAmount");
const countdown = document.getElementById("countdown");
const claimBtn = document.getElementById("claimBtn");
const historyList = document.getElementById("historyList");

claimBtn.disabled = true;

let nextClaimTime = 0;

// ===============================
// LOAD REAL EARNINGS STATE FROM THE SERVER
// ===============================

async function loadEarningsState() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/earnings/${currentUser.phone}`
        );
        const data = await response.json();

        earningAmount.innerHTML = "KSh " + Number(data.todayEarning || 0).toLocaleString();
        nextClaimTime = data.nextClaimTime || 0;
        claimBtn.disabled = !data.canClaim;

    } catch (error) {
        console.log(error);
        countdown.innerHTML = "Unable to load earnings.";
    }
}

// ===============================
// COUNTDOWN DISPLAY (server decides canClaim; this just displays the timer)
// ===============================

function renderCountdown() {

    const now = Date.now();

    if (now >= nextClaimTime) {
        countdown.innerHTML = "Ready to Claim";
        // Don't flip claimBtn.disabled here based on the clock alone —
        // loadEarningsState() re-confirms with the server before enabling it.
    } else {
        const remaining = nextClaimTime - now;
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        countdown.innerHTML = `Next claim in ${hours}h ${minutes}m`;
        claimBtn.disabled = true;
    }

}

setInterval(renderCountdown, 60000);

// ===============================
// LOAD REAL EARNINGS HISTORY FROM THE DATABASE
// ===============================

async function loadHistory() {

    historyList.innerHTML = "";

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/earnings-history?phone=${currentUser.phone}`
        );
        const history = await response.json();

        if (!history || history.length === 0) {
            historyList.innerHTML = "<p>No earnings claimed yet.</p>";
            return;
        }

        history.forEach(item => {
            historyList.innerHTML += `
            <div class="history-item">
                <h3>+ KSh ${Number(item.amount).toLocaleString()}</h3>
                <p>${new Date(item.claimedAt).toLocaleString()}</p>
            </div>
            `;
        });

    } catch (error) {
        historyList.innerHTML = "<p>Unable to load earnings history.</p>";
        console.log(error);
    }

}

// ===============================
// CLAIM EARNINGS — server verifies eligibility and amount, not the client
// ===============================

claimBtn.onclick = async function () {

    claimBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/claim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: currentUser.phone })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Could not claim earnings.");
            await loadEarningsState();
            return;
        }

        alert(`Daily earnings received: KSh ${Number(data.amount).toLocaleString()}`);

        renderCountdown();
        await loadEarningsState();
        await loadHistory();

    } catch (error) {
        alert("Could not connect to the server. Try again.");
        console.log(error);
        await loadEarningsState();
    }

};

// ===============================
// INITIAL LOAD
// ===============================

loadEarningsState().then(renderCountdown);
loadHistory();
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
