// ===============================
// PRIMEVEST PAYMENT
// ===============================

const API_BASE_URL = "https://fuliza-backend-xgsm.onrender.com";

const product = JSON.parse(localStorage.getItem("selectedProduct"));
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

console.log("selectedProduct:", product);
console.log("currentUser:", currentUser);

if (!product) {
    document.getElementById("planName").innerHTML = "No product selected";
    document.getElementById("amount").innerHTML = "KSh 0";
}

if (!currentUser) {
    alert("Please log in again.");
    window.location.href = "index.html";
}

const planName = document.getElementById("planName");
const amount = document.getElementById("amount");
const phone = document.getElementById("phone");
const payBtn = document.getElementById("payBtn");
const status = document.getElementById("status");

planName.innerHTML = product.name;
amount.innerHTML = "KSh " + product.invest.toLocaleString();
phone.value = currentUser.phone;

// ===============================
// PAY
// ===============================

payBtn.addEventListener("click", async () => {

    const phoneNumber = phone.value.trim();

    if (!/^254(7|1)\d{8}$/.test(phoneNumber)) {

        status.style.color = "red";
        status.innerHTML = "Enter a valid Safaricom number.";

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

                    amount: product.invest,

                    accountReference: "PrimeVest",

                    transactionDesc: product.name

                })

            });

        const data = await response.json();

        if (!response.ok) {

            status.style.color = "red";
            status.innerHTML =
                data.error || "Unable to send STK Push.";

