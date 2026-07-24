const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";

loginBtn.onclick = () => {

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value.trim();

if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){

localStorage.setItem("adminLoggedIn","true");

window.location.href="index.html";

}else{

message.innerHTML="Invalid username or password.";

}

};
