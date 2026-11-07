const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function showMessage(message, success = false) {
    const element = document.getElementById("formMessage");
    element.textContent = message;
    element.classList.toggle("success", success);
}

if (getToken()) {
    // Existing sessions can go straight to the dashboard.
    window.location.replace("dashboard.html");
}

loginForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const button = loginForm.querySelector("button[type='submit']");
    button.disabled = true;
    showMessage("Logging in...");
    try {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value
            })
        });
        saveSession(data);
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message);
    } finally {
        button.disabled = false;
    }
});

registerForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const button = registerForm.querySelector("button[type='submit']");
    button.disabled = true;
    showMessage("Creating your account...");
    try {
        const data = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value
            })
        });
        saveSession(data);
        window.location.href = "dashboard.html";
    } catch (error) {
        showMessage(error.message);
    } finally {
        button.disabled = false;
    }
});
