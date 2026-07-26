// ===============================
// PRIMEVEST PROFILE
// ===============================

let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "index.html";
}

// ===============================
// DISPLAY USER DETAILS
// ===============================

document.getElementById("username").innerHTML = currentUser.username;
document.getElementById("phone").innerHTML = currentUser.phone;

document.getElementById("balance").innerHTML =
    "KSh " + (currentUser.balance || 0).toLocaleString();

document.getElementById("investment").innerHTML =
    "KSh " + (currentUser.totalInvestment || 0).toLocaleString();

document.getElementById("earnings").innerHTML =
    "KSh " + (currentUser.totalEarnings || 0).toLocaleString();

document.getElementById("withdrawn").innerHTML =
    "KSh " + (currentUser.totalWithdrawn || 0).toLocaleString();

// ===============================
// REFERRAL CODE
// ===============================

document.getElementById("referralCode").value =
    currentUser.referralCode;

// Change this to your deployed website URL
const WEBSITE_URL = "https://primevest.vercel.app";

document.getElementById("referralLink").value =
    WEBSITE_URL + "/register.html?ref=" + currentUser.referralCode;

// ===============================
// COPY INVITATION CODE
// ===============================

document.getElementById("copyCode").onclick = function () {

    navigator.clipboard.writeText(
        document.getElementById("referralCode").value
    );

    alert("Invitation code copied.");

};

// ===============================
// COPY REFERRAL LINK
// ===============================

document.getElementById("copyLink").onclick = function () {

    navigator.clipboard.writeText(
        document.getElementById("referralLink").value
    );

    alert("Referral link copied.");

};

// ===============================
// LOGOUT
// ===============================

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

    }

}

// ===============================
// KEEP USER DATA UPDATED
// ===============================

function refreshUser() {

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUser = users.find(
        user => user.phone === currentUser.phone
    );

    if (updatedUser) {

        currentUser = updatedUser;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(updatedUser)
        );

    }

}

refreshUser();
