const loginCard = document.getElementById("login-card");
const loginBtn = document.getElementById("login-btn");
const loginLink = document.getElementById("login-link");
const regCard = document.getElementById("reg-card");
const regBtn = document.getElementById("reg-btn");
const regLink = document.getElementById("reg-link");
const app = document.getElementById("app");
const logoutBtn = document.getElementById("logout")
const loginUserInput = document.getElementById("login-user-input");
const loginPassInput = document.getElementById("login-pass-input");
const regUserInput = document.getElementById("reg-user-input");
const regPassInput = document.getElementById("reg-pass-input");
const confirmLogout = document.getElementById("confirm-logout")
const confirmLogoutBtn = document.getElementById("confirm-logout-btn")
const cancleLogout = document.getElementById("cancle-logout-btn")
const navLinks = document.querySelectorAll(".nav-link");
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const navUser = document.getElementById("nav-user")
const addTransactionBtn = document.getElementById("add-transaction")
const saveTransactionBtn = document.getElementById("save-transaction")
const transactionForm = document.getElementById("transaction-form")
const closeForm = document.getElementById("close-form")
const dashboard = document.getElementById("dashboard")
const setting = document.getElementById("setting")
const dashboardSec = document.getElementById("dashboard-sec")
const settingSec = document.getElementById("setting-sec")
const cashFlowChart = document.getElementById("cash-chart")
const updateName = document.getElementById("update-name")
const updateProfileBtn = document.getElementById("update-profile")


const VIEWS = {
    login: {
        el: loginCard,
        bodyClass: "flex items-center justify-center h-screen bg-gray-100"
    },
    register: {
        el: regCard,
        bodyClass: "flex items-center justify-center h-screen bg-gray-100"
    },
    app: {
        el: app,
        bodyClass: "min-h-screen bg-white"
    }
};

function showView(view) {
    const target = VIEWS[view];
    if (!target) return;

    Object.values(VIEWS).forEach(({ el }) => {
        el.classList.add("hidden")
        el.classList.remove("flex")
    });

    target.el.classList.remove("hidden");
    target.el.classList.add("flex");
    document.body.className = target.bodyClass
}
const getValue = (input) => input.value.trim();

window.addEventListener("DOMContentLoaded", () => {
    const hasAcc = localStorage.getItem("username") && localStorage.getItem("password")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn) {
        showView("app")
    } else {
        showView(hasAcc ? "login" : "register")
    }
});

regLink.addEventListener("click", () => {
    showView("register")
})
loginLink.addEventListener("click", () => {
    showView("login")
})

regBtn.addEventListener("click", () => {
    const username = getValue(regUserInput)
    const password = getValue(regPassInput)

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    alert("Registration successful");

    regUserInput.value = "";
    regPassInput.value = "";
    showView("login");
});

loginBtn.addEventListener("click", () => {
    const username = getValue(loginUserInput);
    const password = getValue(loginPassInput);
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");

    if (!savedUsername || !savedPassword) {
        alert("User does not exist");
        showView("register");
        return;
    }

    if (username === savedUsername && password === savedPassword) {
        alert("Login successful");
        localStorage.setItem("isLoggedIn", "true")
        loginUserInput.value = "";
        loginPassInput.value = "";
        showView("app");
    } else {
        alert("Username or Password is wrong");
    }
});

{
    addTransactionBtn.addEventListener("click", () => {
        transactionForm.classList.remove("hidden")
    })
    closeForm.addEventListener("click", () => {
        transactionForm.classList.add("hidden")
    })
    saveTransactionBtn.addEventListener("click", (e) => {
        e.preventDefault()
    })

    dashboard.addEventListener("click", () => {
        dashboardSec.classList.remove("hidden")
        settingSec.classList.add("hidden")
    })
    setting.addEventListener("click", () => {
        dashboardSec.classList.add("hidden")
        settingSec.classList.remove("hidden")
    })
}

{
    logoutBtn.addEventListener("click", () => {
        confirmLogout.classList.add("flex")
        confirmLogout.classList.remove("hidden")
    })
    confirmLogoutBtn.addEventListener("click", () => {
        localStorage.setItem("isLoggedIn", "false")
        window.location.reload()
    })
    cancleLogout.addEventListener("click", () => {
        confirmLogout.classList.add("hidden")
        confirmLogout.classList.remove("flex")
    })
}

{
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });

    menuBtn.addEventListener("click", () => {
        sidebar.classList.remove("left-[-100%]");
        sidebar.classList.add("left-0");
        overlay.classList.remove("hidden");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("left-0");
        sidebar.classList.add("left-[-100%]");
        overlay.classList.add("hidden");
    });
}

function updateChart() {
    const ctx = document.getElementById("cashFlowChart").getContext("2d")
}

{
    navUser.textContent = localStorage.username
    updateName.value = localStorage.username
    updateProfileBtn.addEventListener("click", () => {
        username = updateName.value
        localStorage.setItem("username", username)
        navUser.textContent = localStorage.username
    })
}


