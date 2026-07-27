// =====================================
// PRIMEVEST RECHARGE
// =====================================

const API_BASE_URL = "https://investment-mpesa-backend.onrender.com";

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

const balance = document.getElementById("balance");
const phone = document.getElementById("phone");
const amount = document.getElementById("amount");
const payBtn = document.getElementById("payBtn");
const status = document.getElementById("status");
const historyList = document.getElementById("historyList");

// ===============================
// SHOW BALANCE
// ===============================

balance.innerHTML =
    "KSh " + (currentUser.balance || 0).toLocaleString();

phone.value = currentUser.phone;

// ===============================
// LOAD HISTORY
// ===============================

loadHistory();

function loadHistory() {

    historyList.innerHTML = "";

    if (
        !currentUser.rechargeHistory ||
        currentUser.rechargeHistory.length === 0
    ) {

        historyList.innerHTML = "<p>No recharge history.</p>";
        return;

    }

    currentUser.rechargeHistory.forEach(item => {

        historyList.innerHTML += `
        <div class="history-item">
            <h3>KSh ${Number(item.amount).toLocaleString()}</h3>
            <p><strong>Receipt:</strong> ${item.receipt}</p>
            <p><strong>Date:</strong> ${item.date}</p>
        </div>
        `;

    });

}

// ===============================
// PAY
// ===============================

payBtn.onclick = async function () {

    const phoneNumber = phone.value.trim();
    const rechargeAmount = Number(amount.value);

    if (!/^254(7|1)\d{8}$/.test(phoneNumber)) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid Safaricom number.";
        return;

    }

    if (rechargeAmount < 1) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid amount.";
        return;

    }

    status.style.color = "#0d6efd";
    status.innerHTML = "Sending STK Push...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/mpesa/stkpush`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    phone: phoneNumber,

                    amount: rechargeAmount,

                    accountReference: "PrimeVest",

                    transactionDesc: "Wallet Recharge"

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            status.style.color = "red";
            status.innerHTML =
                data.error || "STK Push failed.";

            return;

        }

        const checkoutId =
            data.checkoutRequestId ||
            data.CheckoutRequestID;

        status.innerHTML =
            "STK Push sent. Complete payment on your phone.";

        pollPayment(checkoutId, rechargeAmount);

    }

    catch (error) {

        status.style.color = "red";
        status.innerHTML = "Cannot connect to payment server.";

    }

};

// ===============================
// CHECK PAYMENT
// ===============================

function pollPayment(checkoutId, rechargeAmount) {

    let attempts = 0;

    const timer = setInterval(async () => {

        attempts++;

        if (attempts > 20) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML = "Verification timed out.";

            return;

        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/mpesa/status/${checkoutId}`
            );

            const data = await response.json();

            if (data.status === "pending") {

                return;

            }

            clearInterval(timer);

            if (data.status === "success") {

                completeRecharge(
                    rechargeAmount,
                    data.mpesaReceipt || "Confirmed"
                );

            } else {

                status.style.color = "red";
                status.innerHTML =
                    data.resultDesc || "Payment Failed.";

            }

        }

        catch (error) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML =
                "Unable to verify payment.";

        }

    }, 3000);

}

// ===============================
// SAVE RECHARGE
// ===============================

function completeRecharge(rechargeAmount, receipt) {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        u => u.phone === currentUser.phone
    );

    if (index === -1) return;

    users[index].balance += rechargeAmount;

    if (!users[index].rechargeHistory) {

        users[index].rechargeHistory = [];

    }

    users[index].rechargeHistory.unshift({

        amount: rechargeAmount,

        receipt: receipt,

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
        "✅ Wallet recharged successfully.";

    amount.value = "";

    loadHistory();

}        status.style.color = "red";
        status.innerHTML = "Enter a valid Safaricom number.";
        return;

    }

    if (rechargeAmount < 1) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid amount.";
        return;

    }

    status.style.color = "#0d6efd";
    status.innerHTML = "Sending STK Push...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/mpesa/stkpush`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    phone: phoneNumber,

                    amount: rechargeAmount,

                    accountReference: "PrimeVest",

                    transactionDesc: "Wallet Recharge"

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            status.style.color = "red";
            status.innerHTML =
                data.error || "STK Push failed.";

            return;

        }

        const checkoutId =
            data.checkoutRequestId ||
            data.CheckoutRequestID;

        status.innerHTML =
            "STK Push sent. Complete payment on your phone.";

        pollPayment(checkoutId, rechargeAmount);

    }

    catch (error) {

        status.style.color = "red";
        status.innerHTML = "Cannot connect to payment server.";

    }

};

// ===============================
// CHECK PAYMENT
// ===============================

function pollPayment(checkoutId, rechargeAmount) {

    let attempts = 0;

    const timer = setInterval(async () => {

        attempts++;

        if (attempts > 20) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML = "Verification timed out.";

            return;

        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/mpesa/status/${checkoutId}`
            );

            const data = await response.json();

            if (data.status === "pending") {

                return;

            }

            clearInterval(timer);

            if (data.status === "success") {

                completeRecharge(
                    rechargeAmount,
                    data.mpesaReceipt || "Confirmed"
                );

            } else {

                status.style.color = "red";
                status.innerHTML =
                    data.resultDesc || "Payment Failed.";

            }

        }

        catch (error) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML =
                "Unable to verify payment.";

        }

    }, 3000);

}

// ===============================
// SAVE RECHARGE
// ===============================

function completeRecharge(rechargeAmount, receipt) {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        u => u.phone === currentUser.phone
    );

    if (index === -1) return;

    users[index].balance += rechargeAmount;

    if (!users[index].rechargeHistory) {

        users[index].rechargeHistory = [];

    }

    users[index].rechargeHistory.unshift({

        amount: rechargeAmount,

        receipt: receipt,

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
        "✅ Wallet recharged successfully.";

    amount.value = "";

    loadHistory();

}
}

loadBalance();
loadHistory();

// ===============================
// PAY
// ===============================

payBtn.onclick = async function () {

    const phoneNumber = phone.value.trim();
    const rechargeAmount = Number(amount.value);

    if (!/^254(7|1)\d{8}$/.test(phoneNumber)) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid Safaricom number.";
        return;

    }

    if (rechargeAmount < 1) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid amount.";
        return;

    }

    payBtn.disabled = true;

    status.style.color = "#0d6efd";
    status.innerHTML = "Sending STK Push...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/mpesa/stkpush`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    phone: phoneNumber,

                    amount: rechargeAmount,

                    // Tells the backend this is a wallet top-up, not an
                    // investment, so the callback credits balance only.
                    purpose: "recharge",

                    accountReference: "PrimeVest",

                    transactionDesc: "Wallet Recharge"

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            status.style.color = "red";
            status.innerHTML =
                data.error || "STK Push failed.";

            payBtn.disabled = false;

            return;

        }

        const checkoutId =
            data.checkoutRequestId ||
            data.CheckoutRequestID;

        status.innerHTML =
            "STK Push sent. Complete payment on your phone.";

        pollPayment(checkoutId);

    }

    catch (error) {

        status.style.color = "red";
        status.innerHTML = "Cannot connect to payment server.";
        payBtn.disabled = false;

    }

};

// ===============================
// CHECK PAYMENT AGAINST THE DATABASE
// ===============================

function pollPayment(checkoutId) {

    let attempts = 0;

    const timer = setInterval(async () => {

        attempts++;

        if (attempts > 20) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML = "Verification timed out.";
            payBtn.disabled = false;

            return;

        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/mpesa/status/${checkoutId}`
            );

            const data = await response.json();

            if (data.status === "pending") {
                return;
            }

            clearInterval(timer);

            if (data.status === "success") {
                onRechargeConfirmed(data);
            } else {
                status.style.color = "red";
                status.innerHTML =
                    data.failureReason || "Payment Failed.";
                payBtn.disabled = false;
            }

        }

        catch (error) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML =
                "Unable to verify payment.";
            payBtn.disabled = false;

        }

    }, 3000);

}

// ===============================
// REFRESH FROM THE DATABASE AFTER CONFIRMATION
// ===============================
// `investment` is the real Mongo record for this checkout. The balance
// itself was already credited server-side in /api/mpesa/callback — here we
// just re-fetch the up-to-date numbers rather than computing anything
// ourselves.

async function onRechargeConfirmed(investment) {

    status.style.color = "green";
    status.innerHTML =
        `✅ Wallet recharged successfully. Receipt: ${investment.mpesaReceipt || "N/A"}`;

    amount.value = "";
    payBtn.disabled = false;

    await loadBalance();
    await loadHistory();

}
        status.style.color = "red";
        status.innerHTML = "Enter a valid Safaricom number.";
        return;

    }

    if (rechargeAmount < 1) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid amount.";
        return;

    }

    status.style.color = "#0d6efd";
    status.innerHTML = "Sending STK Push...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/mpesa/stkpush`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    phone: phoneNumber,

                    amount: rechargeAmount,

                    accountReference: "PrimeVest",

                    transactionDesc: "Wallet Recharge"

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            status.style.color = "red";
            status.innerHTML =
                data.error || "STK Push failed.";

            return;

        }

        const checkoutId =
            data.checkoutRequestId ||
            data.CheckoutRequestID;

        status.innerHTML =
            "STK Push sent. Complete payment on your phone.";

        pollPayment(checkoutId, rechargeAmount);

    }

    catch (error) {

        status.style.color = "red";
        status.innerHTML = "Cannot connect to payment server.";

    }

};

// ===============================
// CHECK PAYMENT
// ===============================

function pollPayment(checkoutId, rechargeAmount) {

    let attempts = 0;

    const timer = setInterval(async () => {

        attempts++;

        if (attempts > 20) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML = "Verification timed out.";

            return;

        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/mpesa/status/${checkoutId}`
            );

            const data = await response.json();

            if (data.status === "pending") {

                return;

            }

            clearInterval(timer);

            if (data.status === "success") {

                completeRecharge(
                    rechargeAmount,
                    data.mpesaReceipt || "Confirmed"
                );

            } else {

                status.style.color = "red";
                status.innerHTML =
                    data.resultDesc || "Payment Failed.";

            }

        }

        catch (error) {

            clearInterval(timer);

            status.style.color = "red";
            status.innerHTML =
                "Unable to verify payment.";

        }

    }, 3000);

}

// ===============================
// SAVE RECHARGE
// ===============================

function completeRecharge(rechargeAmount, receipt) {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        u => u.phone === currentUser.phone
    );

    if (index === -1) return;

    users[index].balance += rechargeAmount;

    if (!users[index].rechargeHistory) {

        users[index].rechargeHistory = [];

    }

    users[index].rechargeHistory.unshift({

        amount: rechargeAmount,

        receipt: receipt,

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
        "✅ Wallet recharged successfully.";

    amount.value = "";

    loadHistory();

}
