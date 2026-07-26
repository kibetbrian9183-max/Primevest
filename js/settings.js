const form=document.getElementById("settingsForm");

window.onload=()=>{

document.getElementById("username").value=
localStorage.getItem("username")||"";

document.getElementById("email").value=
localStorage.getItem("email")||"";

document.getElementById("phone").value=
localStorage.getItem("phone")||"";

};

form.addEventListener("submit",(e)=>{

e.preventDefault();

const username=document.getElementById("username").value;

const email=document.getElementById("email").value;

const phone=document.getElementById("phone").value;

const newPassword=document.getElementById("newPassword").value;

const confirm=document.getElementById("confirmPassword").value;

if(newPassword!==confirm){

alert("Passwords do not match.");

return;

}

localStorage.setItem("username",username);
localStorage.setItem("email",email);
localStorage.setItem("phone",phone);

if(newPassword.length>0){

localStorage.setItem("password",newPassword);

}

alert("Account updated successfully.");

window.location.href="profile.html";

});
