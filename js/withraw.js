// ===============================
// PRIMEVEST WITHDRAW
// ===============================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

const balance = document.getElementById("balance");
const method = document.getElementById("method");
const account = document.getElementById("account");
const amount = document.getElementById("amount");
const withdrawBtn = document.getElementById("withdrawBtn");
const status = document.getElementById("status");
const historyList = document.getElementById("historyList");

// ===============================
// SHOW BALANCE
// ===============================

balance.innerHTML =
    "KSh " + (currentUser.balance || 0).toLocaleString();

// ===============================
// LOAD HISTORY
// ===============================

loadHistory();

function loadHistory() {

    historyList.innerHTML = "";

    if (
        !currentUser.withdrawHistory ||
        currentUser.withdrawHistory.length === 0
    ) {

        historyList.innerHTML =
            "<p>No withdrawals yet.</p>";

        return;

    }

    currentUser.withdrawHistory.forEach(item => {

        historyList.innerHTML += `

        <div class="history-item">

            <h3>KSh ${Number(item.amount).toLocaleString()}</h3>

            <p><strong>Method:</strong> ${item.method}</p>

            <p><strong>Account:</strong> ${item.account}</p>

            <p><strong>Date:</strong> ${item.date}</p>

            <p class="${item.status.toLowerCase()}">
                ${item.status}
            </p>

        </div>

        `;

    });

}

// ===============================
// WITHDRAW
// ===============================

withdrawBtn.onclick = function () {

    const phone = account.value.trim();
    const withdrawAmount = Number(amount.value);

    if (!/^254(7|1)\d{8}$/.test(phone)) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid phone number.";

        return;

    }

    if (withdrawAmount < 150) {

        status.style.color = "red";
        status.innerHTML =
            "Minimum withdrawal is KSh 150.";

        return;

    }

    if (withdrawAmount > currentUser.balance) {

        status.style.color = "red";
        status.innerHTML =
            "Insufficient account balance.";

        return;

    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        user => user.phone === currentUser.phone
    );

    if (index === -1) return;

    users[index].balance -= withdrawAmount;

    users[index].totalWithdrawn =
        (users[index].totalWithdrawn || 0) + withdrawAmount;

    if (!users[index].withdrawHistory) {

        users[index].withdrawHistory = [];

    }

    users[index].withdrawHistory.unshift({

        amount: withdrawAmount,

        method: method.value,

        account: phone,

        status: "Processing",

        date: new Date().toLocaleString()

    });

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem(
        "currentUser",
        JSON.stringify(users[index])
    );

    currentUser = users[index];

    balance.innerHTML =
        "KSh " + currentUser.balance.toLocaleString();

    status.style.color = "green";
    status.innerHTML =
        "Withdrawal submitted successfully.";

    account.value = "";
    amount.value = "";

    loadHistory();

};
