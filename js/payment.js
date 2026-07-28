// ===============================
// PRIMEVEST PAYMENT
// ===============================

const API_BASE_URL = "https://fuliza-backend-xgsm.onrender.com";

// ---------------------------------------------------------------
// 1. Load product â€” try localStorage first, then URL query params
// ---------------------------------------------------------------
let product = JSON.parse(localStorage.getItem("selectedProduct"));

if (!product) {
    const params = new URLSearchParams(window.location.search);
    const plan   = params.get("plan");
    const amount = params.get("amount");

    if (plan && amount) {
        product = {
            name:    plan,
            invest:  Number(amount)
        };
    }
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Redirect if not logged in
if (!currentUser) {
    alert("Please log in again.");
    window.location.href = "index.html";
}

// Redirect if still no product
if (!product) {
    alert("No plan selected. Please choose a plan first.");
    window.location.href = "home.html";
}

// ---------------------------------------------------------------
// 2. Populate the UI
// ---------------------------------------------------------------
const planName = document.getElementById("planName");
const amount   = document.getElementById("amount");
const phone    = document.getElementById("phone");
const payBtn   = document.getElementById("payBtn");
const status   = document.getElementById("status");

planName.innerHTML = product.name;
amount.innerHTML   = "KSh " + product.invest.toLocaleString();
phone.value        = currentUser.phone;

// ===============================
// PAY
// ===============================

payBtn.addEventListener("click", async () => {

    const phoneNumber = phone.value.trim();

    if (!/^254(7|1)\d{8}$/.test(phoneNumber)) {
        status.style.color = "red";
        status.innerHTML   = "Enter a valid Safaricom number.";
        return;
    }

    payBtn.disabled      = true;
    status.style.color   = "#0d6efd";
    status.innerHTML     = "Sending STK Push...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/mpesa/stkpush`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone:            phoneNumber,
                amount:           product.invest,
                accountReference: "PrimeVest",
                transactionDesc:  product.name
            })
        });

        const data = await response.json();

        if (!response.ok) {
            status.style.color = "red";
            status.innerHTML   = data.error || "Unable to send STK Push.";
            payBtn.disabled    = false;
            return;
        }

        const checkoutId = data.checkoutRequestId || data.CheckoutRequestID;
        status.innerHTML = "STK Push sent. Complete payment on your phone.";
        pollPayment(checkoutId);

    } catch (error) {
        status.style.color = "red";
        status.innerHTML   = "Cannot connect to payment server.";
        payBtn.disabled    = false;
        console.error(error);
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
            status.innerHTML   = "Payment verification timed out.";
            payBtn.disabled    = false;
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/mpesa/status/${checkoutId}`);
            const data     = await response.json();

            if (data.status === "SUCCESS" || data.ResultCode === "0") {
                clearInterval(timer);
                showPaymentSuccess(data);
            } else if (data.status === "FAILED" || (data.ResultCode && data.ResultCode !== "0")) {
                clearInterval(timer);
                status.style.color = "red";
                status.innerHTML   = "Payment failed. Please try again.";
                payBtn.disabled    = false;
            }

        } catch (error) {
            clearInterval(timer);
            status.style.color = "red";
            status.innerHTML   = "Unable to verify payment.";
            payBtn.disabled    = false;
        }

    }, 3000);
}

// ===============================
// ON SUCCESS
// ===============================

function showPaymentSuccess(payment) {
    status.style.color = "green";
    status.innerHTML   = `âœ… Payment Successful! Receipt: ${payment.mpesaReceipt || "N/A"}. Redirecting...`;

    setTimeout(() => {
        window.location.href = "home.html";
    }, 2000);
}        const data = await response.json();

        if (!response.ok) {

            status.style.color = "red";
            status.innerHTML =
                data.error || "Unable to send STK Push.";

        }

    } catch (err) {

        status.style.color = "red";
        status.innerHTML = "Network error. Please try again.";

    }

});                data.error || "Unable to send STK Push.";

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

}            status.style.color = "red";
            status.innerHTML =
                data.error || "Unable to send STK Push.";

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

        status.innerHTML =
            "Cannot connect to payment server.";

        payBtn.disabled = false;

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

                showPaymentSuccess(data);

            }

            else {

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
// CONFIRM PAYMENT (no balance/bonus fabrication — that requires backend
// support the server no longer provides, since real returns aren't
// something the client can legitimately grant itself)
// ===============================

function showPaymentSuccess(payment) {

    status.style.color = "green";

    status.innerHTML =
        `✅ Payment Successful! Receipt: ${payment.mpesaReceipt || "N/A"}. Redirecting...`;

    setTimeout(() => {

        window.location.href = "home.html";

    }, 2000);

}

            });

        const data = await response.json();

        if (!response.ok) {

            status.style.color = "red";
            status.innerHTML =
                data.error || "Unable to send STK Push.";

