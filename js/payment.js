// ===============================
// PRIMEVEST PAYMENT
// ===============================

const API_BASE_URL = "https://fuliza-backend-xgsm.onrender.com";

const product = JSON.parse(localStorage.getItem("selectedProduct"));
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!product || !currentUser) {
    window.location.href = "home.html";
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

        status.innerHTML =
            "Cannot connect to payment server.";

        console.log(error);

    }

});

// ===============================
// CHECK PAYMENT STATUS
// ===============================

function pollPayment(checkoutId) {

    let attempts = 0;

    const timer = setInterval(async () => {

        attempts++;

        if (attempts > 20) {

            clearInterval(timer);

            status.style.color = "red";

            status.innerHTML =
                "Payment verification timed out.";

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

                completeInvestment();

            }

            else {

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
// SAVE INVESTMENT
// ===============================

function completeInvestment() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(
        u => u.phone === currentUser.phone
    );

    if (index === -1) return;

    // First investment bonus
    if (users[index].products.length === 0) {

        users[index].balance += 150;

    }

    users[index].investmentBalance += product.invest;

    users[index].totalInvestment += product.invest;

    users[index].products.push({

        ...product,

        purchaseDate: Date.now(),

        lastClaim: Date.now()

    });

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem(
        "currentUser",
        JSON.stringify(users[index])
    );

    status.style.color = "green";

    status.innerHTML =
        "✅ Payment Successful! Redirecting...";

    setTimeout(() => {

        window.location.href = "home.html";

    }, 2000);

}
