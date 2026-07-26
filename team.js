// ============================
// PRIMEVEST TEAM PAGE
// ============================

// Generate invitation code (only once)

let inviteCode = localStorage.getItem("inviteCode");

if (!inviteCode) {
    inviteCode = "PV" + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("inviteCode", inviteCode);
}

document.getElementById("inviteCode").innerText = inviteCode;


// Referral link

const referralLink =
window.location.origin +
"/register.html?ref=" +
inviteCode;

document.getElementById("refLink").value = referralLink;


// Copy button

document.getElementById("copyBtn").addEventListener("click", () => {

    navigator.clipboard.writeText(referralLink);

    alert("Invitation link copied successfully.");

});


// Team statistics

const members =
Number(localStorage.getItem("teamMembers")) || 0;

const active =
Number(localStorage.getItem("activeMembers")) || 0;

const bonus =
Number(localStorage.getItem("referralBonus")) || 0;

document.getElementById("members").innerText = members;
document.getElementById("active").innerText = active;
document.getElementById("bonus").innerText = bonus.toLocaleString();


// ============================
// SHARE BUTTONS
// ============================

const message =
`Join PrimeVest and start earning daily.\n${referralLink}`;

const shareButtons =
document.querySelectorAll(".share-icons a");

shareButtons[0].href =
`https://wa.me/?text=${encodeURIComponent(message)}`;

shareButtons[1].href =
`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;

shareButtons[2].href =
`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join PrimeVest today!")}`;

shareButtons[3].href =
`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;

shareButtons.forEach(button => {

    button.target = "_blank";

});


// ============================
// REFERRAL BONUS
// ============================

// When a referred user registers using your invitation
// code and purchases a product, your backend or future
// app logic can update these values.

console.log("PrimeVest Team Page Loaded");
