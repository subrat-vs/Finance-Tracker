const loginUi = document.getElementById("login-card")
const regUi = document.getElementById("reg-card")
const loginLink = document.getElementById("login-link")
const regLink = document.getElementById("reg-link")
const loginBtn = document.getElementById("login-btn")
const regBtn = document.getElementById("reg-btn")
const app = document.getElementById("app")
const regUser = document.getElementById("reg-user-input")
const regPass = document.getElementById("reg-pass-input")
const loginUser = document.getElementById("login-user-input")
const loginPass = document.getElementById("login-pass-input")

const logoutBtn = document.getElementById("logout")
const confirmLogout = document.getElementById("confirm-logout")
const confirmLogoutBtn = document.getElementById("confirm-logout-btn")
const cancleLogoutBtn = document.getElementById("cancle-logout-btn")

const navUser = document.getElementById("nav-user")
const updateName = document.getElementById("update-name")
const updateProfileBtn = document.getElementById("update-profile")

const navLinks = document.querySelectorAll(".nav-link")
const menuBtn = document.getElementById("menu-btn")
const sidebar = document.getElementById("sidebar")
const overlay = document.getElementById("overlay")

const dashboard = document.getElementById("dashboard")
const setting = document.getElementById("setting")
const dashboardSec = document.getElementById("dashboard-sec")
const settingSec = document.getElementById("setting-sec")

const addTransactionBtn = document.getElementById("add-transaction")
const saveTransactionBtn = document.getElementById("save-transaction")
const transactionForm = document.getElementById("transaction-form")
const closeForm = document.getElementById("close-form")
const cashChartCanvas = document.getElementById("cash-chart")
const searchInput = document.getElementById("search-transaction")
const filterType = document.getElementById("filter-type")
const transactionTableBody = document.getElementById("transactionTableBody")
const typeInput = document.getElementById("type")
const descriptionInput = document.getElementById("description")
const amountInput = document.getElementById("amount")
const dateInput = document.getElementById("date")
const categoryInput = document.getElementById("category")
const balanceEl = document.getElementById("balance-amount")
const incomeEl = document.getElementById("income-amount")
const expenseEl = document.getElementById("expense-amount")
const countEl = document.getElementById("transaction-count")
const resetBtn = document.getElementById("reset-data")
const modalBackdrop = document.getElementById("modal-backdrop")

const themeToggle = document.getElementById("toggle")

const VIEWS = {
    login: {
        el: loginUi,
        bodyClass: "flex items-center justify-center h-screen bg-gray-100",
        title: "Login | FinTrack"
    },
    reg: {
        el: regUi,
        bodyClass: "flex items-center justify-center h-screen bg-gray-100",
        title: "Register | FinTrack"
    },
    app: {
        el: app,
        bodyClass: "min-h-screen bg-white dark:bg-zinc-950",
        title: "FinTrack"
    }
}

function showView(view) {
    const target = VIEWS[view]
    if (!target) return

    Object.values(VIEWS).forEach(({ el }) => {
        el.classList.add("hidden")
        el.classList.remove("flex")
    })

    target.el.classList.add("flex")
    target.el.classList.remove("hidden")
    document.body.className = target.bodyClass
    document.title = target.title
}

const getValue = (input) => input.value.trim()

function clrInput(...inputs) {
    inputs.forEach(input => input.value = "")
}

function toggleVisible(el, show) {
    el.classList.toggle("flex", show)
    el.classList.toggle("hidden", !show)
}

let activeModal = null

function openModal(el) {
    activeModal = el
    toggleVisible(el, true)
    toggleVisible(modalBackdrop, true)
}

function closeModal() {
    if (activeModal) toggleVisible(activeModal, false)
    toggleVisible(modalBackdrop, false)
    activeModal = null
}

function openSidebar() {
    sidebar.classList.remove("left-[-100%]")
    sidebar.classList.add("left-0")
    overlay.classList.remove("hidden")
}

function closeSidebar() {
    sidebar.classList.remove("left-0")
    sidebar.classList.add("left-[-100%]")
    overlay.classList.add("hidden")
}

let editingId = null
let cashChart = null

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
const formatAmount = (num) => `$${Math.abs(num).toFixed(2)}`

function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || []
}

function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

function renderTransactions() {
    const search = getValue(searchInput).toLowerCase()
    const filter = filterType.value
    const transactions = getTransactions()

    const filtered = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(search)
        const matchesType = filter === "all" || t.type === filter
        return matchesSearch && matchesType
    })

    transactionTableBody.innerHTML = filtered.map(t => `
        <tr class="border-b dark:border-zinc-800">
            <td class="py-2">${t.date}</td>
            <td>${t.description}</td>
            <td class="capitalize">${t.category}</td>
            <td class="${t.type === "income" ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"}">
                ${t.type === "income" ? "+" : "-"}${formatAmount(t.amount)}
            </td>
            <td><button class="edit-btn cursor-pointer" data-id="${t.id}">Edit</button></td>
            <td><button class="delete-btn cursor-pointer" data-id="${t.id}">Delete</button></td>
        </tr>
    `).join("")

    transactionTableBody.querySelectorAll(".edit-btn").forEach(btn =>
        btn.addEventListener("click", () => startEditTransaction(btn.dataset.id))
    )
    transactionTableBody.querySelectorAll(".delete-btn").forEach(btn =>
        btn.addEventListener("click", () => deleteTransaction(btn.dataset.id))
    )
}

function renderSummary() {
    const transactions = getTransactions()
    const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    balanceEl.textContent = formatAmount(income - expense)
    incomeEl.textContent = formatAmount(income)
    expenseEl.textContent = formatAmount(expense)
    countEl.textContent = transactions.length
}

function updateChart() {
    if (!cashChart) return
    const sorted = [...getTransactions()].sort((a, b) => new Date(a.date) - new Date(b.date))

    cashChart.data.labels = sorted.map(t => t.date)
    cashChart.data.datasets[0].data = sorted.map(t => t.type === "income" ? t.amount : 0)
    cashChart.data.datasets[1].data = sorted.map(t => t.type === "expense" ? t.amount : 0)
    cashChart.update()
}

function refreshAll() {
    renderTransactions()
    renderSummary()
    updateChart()
}

function resetTransactionForm() {
    clrInput(descriptionInput, amountInput, dateInput)
    typeInput.value = "income"
    categoryInput.selectedIndex = 0
    editingId = null
}

function handleSaveTransaction(e) {
    e.preventDefault()

    const type = typeInput.value
    const description = getValue(descriptionInput)
    const amount = parseFloat(amountInput.value)
    const date = dateInput.value
    const category = categoryInput.value

    if (!description || !amount || !date || !category) {
        alert("Please fill all fields")
        return
    }
    if (amount <= 0) {
        alert("Amount must be greater than 0")
        return
    }

    const transactions = getTransactions()

    if (editingId) {
        const index = transactions.findIndex(t => t.id === editingId)
        if (index !== -1) transactions[index] = { id: editingId, type, description, amount, date, category }
    } else {
        transactions.push({ id: generateId(), type, description, amount, date, category })
    }

    saveTransactions(transactions)
    resetTransactionForm()
    closeModal()
    refreshAll()
}

function startEditTransaction(id) {
    const transaction = getTransactions().find(t => t.id === id)
    if (!transaction) return

    editingId = id
    typeInput.value = transaction.type
    descriptionInput.value = transaction.description
    amountInput.value = transaction.amount
    dateInput.value = transaction.date
    categoryInput.value = transaction.category

    openModal(transactionForm)
}

function deleteTransaction(id) {
    if (!confirm("Delete this transaction?")) return
    saveTransactions(getTransactions().filter(t => t.id !== id))
    refreshAll()
}

// Enter key: move to next input, or submit on the last one
function keyEnter(inputs, submitFn) {
    inputs.forEach((input, index) => {
        input.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return
            const nextInput = inputs[index + 1]
            nextInput ? nextInput.focus() : submitFn()
        })
    })
}

function updateNavUser() {
    const savedUsername = localStorage.getItem("username")
    navUser.textContent = savedUsername
    updateName.value = savedUsername
}

function handleReg() {
    const username = getValue(regUser)
    const password = getValue(regPass)

    if (!username || !password) {
        alert("Please fill all fields")
        return
    }

    localStorage.setItem("username", username)
    localStorage.setItem("password", password)
    clrInput(regUser, regPass)
    showView("login")
}

function handleLogin() {
    const username = getValue(loginUser)
    const password = getValue(loginPass)
    const savedUsername = localStorage.getItem("username")
    const savedPassword = localStorage.getItem("password")

    if (!savedUsername || !savedPassword) {
        alert("User does not exist")
        showView("reg")
        return
    }

    if (username !== savedUsername || password !== savedPassword) {
        alert("Username or Password is wrong")
        return
    }

    localStorage.setItem("isLoggedIn", "true")
    clrInput(loginUser, loginPass)
    updateNavUser()
    showView("app")
}

regLink.addEventListener("click", () => showView("reg"))
loginLink.addEventListener("click", () => showView("login"))
regBtn.addEventListener("click", handleReg)
loginBtn.addEventListener("click", handleLogin)
keyEnter([regUser, regPass], handleReg)
keyEnter([loginUser, loginPass], handleLogin)

logoutBtn.addEventListener("click", () => openModal(confirmLogout))
cancleLogoutBtn.addEventListener("click", closeModal)
confirmLogoutBtn.addEventListener("click", () => {
    localStorage.setItem("isLoggedIn", "false")
    window.location.reload()
})

modalBackdrop.addEventListener("click", closeModal)

updateProfileBtn.addEventListener("click", () => {
    const username = getValue(updateName)
    if (!username) {
        alert("Name cannot be empty")
        return
    }
    localStorage.setItem("username", username)
    navUser.textContent = username
})

dashboard.addEventListener("click", () => {
    dashboardSec.classList.remove("hidden")
    settingSec.classList.add("hidden")
})

setting.addEventListener("click", () => {
    dashboardSec.classList.add("hidden")
    settingSec.classList.remove("hidden")
})

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(item => item.classList.remove("active"))
        link.classList.add("active")
        closeSidebar()
    })
})

menuBtn.addEventListener("click", openSidebar)
overlay.addEventListener("click", closeSidebar)

addTransactionBtn.addEventListener("click", () => {
    closeSidebar() // sidebar action -> close it on mobile
    resetTransactionForm() 
    openModal(transactionForm)
})

closeForm.addEventListener("click", () => {
    resetTransactionForm()
    closeModal()
})

saveTransactionBtn.addEventListener("click", handleSaveTransaction)
searchInput.addEventListener("input", renderTransactions)
filterType.addEventListener("change", renderTransactions)
resetBtn.addEventListener("click", () => {
    if (!confirm("This will delete all transactions. Continue?")) return
    localStorage.removeItem("transactions")
    refreshAll()
})

function applyTheme(isDark) {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "light" : "dark")
    if (themeToggle) themeToggle.checked = isDark
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark))
}

themeToggle.addEventListener("change", () => applyTheme(themeToggle.checked))

function initChart() {
    if (!cashChartCanvas || typeof Chart === "undefined") return

    cashChart = new Chart(cashChartCanvas.getContext("2d"), {
        type: "line",
        data: {
            labels: [],
            datasets: [
                { label: "Income", data: [], borderColor: "#15803d", tension: 0.3 },
                { label: "Expense", data: [], borderColor: "#b91c1c", tension: 0.3 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    })
}

window.addEventListener("DOMContentLoaded", () => {
    initTheme()

    const hasAcc = localStorage.getItem("username") && localStorage.getItem("password")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn) updateNavUser()
    isLoggedIn ? showView("app") : showView(hasAcc ? "login" : "reg")

    initChart()
    refreshAll()
})