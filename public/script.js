// ==========================================
// ELEMENTS
// ==========================================

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");


// ==========================================
// SWITCH TO REGISTER
// ==========================================

showRegister.addEventListener("click", () => {

    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");

    loginMessage.textContent = "";
});


// ==========================================
// SWITCH TO LOGIN
// ==========================================

showLogin.addEventListener("click", () => {

    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");

    registerMessage.textContent = "";
});


// ==========================================
// REGISTER USER
// ==========================================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    registerMessage.textContent = "Creating account...";
    registerMessage.style.color = "#2563eb";

    try {

        const response = await fetch("/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })

        });


        const data = await response.json();


        if (response.ok) {

            registerMessage.textContent =
                "Registration successful! Please login.";

            registerMessage.style.color = "green";

            registerForm.reset();

            setTimeout(() => {

                registerBox.classList.add("hidden");
                loginBox.classList.remove("hidden");

                registerMessage.textContent = "";

            }, 1500);

        } else {

            registerMessage.textContent =
                data.message || "Registration failed";

            registerMessage.style.color = "red";
        }

    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Unable to connect to server.";

        registerMessage.style.color = "red";
    }

});


// ==========================================
// LOGIN USER
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    loginMessage.textContent = "Logging in...";
    loginMessage.style.color = "#2563eb";

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });


        const data = await response.json();


        if (response.ok) {

            // Store JWT token
            localStorage.setItem("token", data.token);

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            loginMessage.textContent =
                "Login successful!";

            loginMessage.style.color = "green";


            // Open dashboard
            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 700);

        } else {

            loginMessage.textContent =
                data.message || "Invalid email or password";

            loginMessage.style.color = "red";
        }

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Unable to connect to server.";

        loginMessage.style.color = "red";
    }

});