// ============================= Firebase  ==================================
import {
    app,
    auth
} from ".././firebase/firebase-config.js";
import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// ============================= All Variables  ==================================
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const loginBtn = document.querySelector(".login");
const loader = document.querySelector(".login-btn-changer");
const mainError = document.querySelector(".main-error");

// ============================= Main Function  ==================================
const loginData = async () => {
    if (email.value !== "" || password.value !== "") {
        try {
            loader.innerHTML = `<div class="loader"></div>`;
            await signInWithEmailAndPassword(auth, email.value, password.value)
            localStorage.setItem("admin-pass", password.value);
            loader.innerHTML = "Login"
            location = ".././admin.html";
        }
        catch (error) {
            if (error.message === `Firebase: Error (auth/user-not-found).`) {
                mainError.innerHTML = "You don't have any account."
                mainError.classList.add("error");
                mainError.style.display = "block";
                loader.innerHTML = "Login"
                childClearError()
            } else if (error.message === `Firebase: Error (auth/wrong-password).`) {
                mainError.innerHTML = `Wrong Password.`
                mainError.classList.add("error");
                mainError.style.display = "block";
                loader.innerHTML = "Login"
                childClearError()
            }
        }
    } else {
        mainError.innerHTML = "Please Fill All Input Fields."
        mainError.classList.add("error");
        mainError.style.display = "block";
        childClearError()
    }
}
loginBtn.addEventListener("click", loginData);

function clearAllError() {
    mainError.innerHTML = "";
    mainError.style.display = "none";
}
function childClearError() {
    setTimeout(clearAllError, 4000);
}