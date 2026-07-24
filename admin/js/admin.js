// ======================================
// PRIMEVEST ADMIN DASHBOARD
// ======================================

// Get all registered users
const users = JSON.parse(localStorage.getItem("users")) || [];

// Dashboard Elements
const totalUsers = document.getElementById("totalUsers");
const totalInvestment = document.getElementById("totalInvestment");
const totalRecharge = document.getElementById("totalRecharge");
const totalWithdraw = document.getElementById("totalWithdraw");
const usersTable = document.getElementById("usersTable");
const logoutBtn = document.getElementById("logoutBtn");

// ======================================
// DASHBOARD TOTALS
// ======================================

let investmentTotal = 0;
let rechargeTotal = 0;
let withdrawTotal = 0;

users.forEach(user => {

    investmentTotal += Number(user.totalInvestment || 0);

    withdrawTotal += Number(user.totalWithdrawn || 0);

    if (user.rechargeHistory) {

        user.rechargeHistory.forEach(item => {

            rechargeTotal += Number(item.amount);

        });

    }

});

totalUsers.innerHTML = users.length;

totalInvestment.innerHTML =
    "KSh " + investmentTotal.toLocaleString();

totalRecharge.innerHTML =
    "KSh " + rechargeTotal.toLocaleString();

totalWithdraw.innerHTML =
    "KSh " + withdrawTotal.toLocaleString();

// ======================================
// USERS TABLE
// ======================================

usersTable.innerHTML = "";

if (users.length === 0) {

    usersTable.innerHTML = `
        <tr>
            <td colspan="4">No registered users.</td>
        </tr>
    `;

} else {

    users.forEach(user => {

        usersTable.innerHTML += `

        <tr>

            <td>${user.username}</td>

            <td>${user.phone}</td>

            <td>KSh ${(user.balance || 0).toLocaleString()}</td>

            <td>KSh ${(user.totalInvestment || 0).toLocaleString()}</td>

        </tr>

        `;

    });

}

// ======================================
// LOGOUT
// ======================================

logoutBtn.addEventListener("click", () => {

    if (confirm("Logout from Admin Dashboard?")) {

        window.location.href = "../index.html";

    }

});

// ======================================
// AUTO REFRESH
// ======================================

setInterval(() => {

    location.reload();

}, 30000);
