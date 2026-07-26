// ================================
// PRIMEVEST AUTH SYSTEM
// Uses localStorage (No Database)
// ================================

// ---------- Generate Referral Code ----------
function generateReferralCode() {
    return "PV" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ---------- REGISTER ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const referralInput = document.getElementById("referralCode").value.trim();

        const phoneRegex = /^254(7|1)\d{8}$/;

        if (!phoneRegex.test(phone)) {
            alert("Enter a valid phone number.\nExample: 254712345678");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const exists = users.find(user =>
            user.phone === phone || user.email === email
        );

        if (exists) {
            alert("Account already exists.");
            return;
        }

        // Check referral
        let bonus = 0;

        if (referralInput !== "") {

            const referrer = users.find(user => user.referralCode === referralInput);

            if (referrer) {
                bonus = 100;
                referrer.balance += 100;
            }
        }

        const newUser = {

            username,

            email,

            phone,

            password,

            referralCode: generateReferralCode(),

            referredBy: referralInput,

            balance: bonus,

            investmentBalance: 0,

            totalInvestment: 0,

            totalWithdrawn: 0,

            totalEarnings: 0,

            earningsHistory: [],

            withdrawalHistory: [],

            rechargeHistory: [],

            products: []

        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", JSON.stringify(newUser));

        alert("Registration Successful!");

        window.location.href = "home.html";

    });

}

// ---------- LOGIN ----------

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const loginUser = document.getElementById("loginUser").value.trim().toLowerCase();

        const loginPassword = document.getElementById("loginPassword").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(u =>
            (u.email === loginUser || u.phone === loginUser)
            && u.password === loginPassword
        );

        if (!user) {

            alert("Invalid Login Details");

            return;

        }

        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Login Successful!");

        window.location.href = "home.html";

    });

}
