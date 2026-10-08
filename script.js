// ===============================
// MONEY TRACKER
// ===============================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let transactionType = "expense";


// ===============================
// CURRENT MONTH
// ===============================

const currentMonth = document.getElementById("currentMonth");

const date = new Date();

currentMonth.textContent =
    date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });


// ===============================
// TYPE BUTTONS
// ===============================

const typeButtons =
    document.querySelectorAll(".type-btn");

const typeInput =
    document.getElementById("transactionType");

typeButtons.forEach(button => {

    button.addEventListener("click", () => {

        typeButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        transactionType =
            button.dataset.type;

        typeInput.value =
            transactionType;
    });

});


// ===============================
// FORM
// ===============================

const form =
    document.getElementById("transactionForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount =
        Number(document.getElementById("amount").value);

    const category =
        document.getElementById("category").value;

    const description =
        document.getElementById("description").value;

    if (amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const transaction = {

        id: Date.now(),

        type: transactionType,

        amount: amount,

        category: category,

        description: description,

        date: new Date().toLocaleDateString("en-IN")
    };


    transactions.unshift(transaction);

    saveData();

    render();

    form.reset();

    // Reset expense button

    transactionType = "expense";

    typeButtons.forEach(btn =>
        btn.classList.remove("active")
    );

    typeButtons[0].classList.add("active");

});


// ===============================
// SAVE DATA
// ===============================

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ===============================
// UPDATE SUMMARY
// ===============================

function updateSummary() {

    let income = 0;

    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });


    const balance = income - expense;


    document.getElementById("income")
        .textContent = formatMoney(income);

    document.getElementById("expense")
        .textContent = formatMoney(expense);

    document.getElementById("balance")
        .textContent = formatMoney(balance);

}


// ===============================
// FORMAT MONEY
// ===============================

function formatMoney(amount) {

    return "₹" +
        amount.toLocaleString("en-IN");

}


// ===============================
// DISPLAY TRANSACTIONS
// ===============================

function renderTransactions() {

    const list =
        document.getElementById("transactionList");


    if (transactions.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <div>💸</div>

                <h3>No transactions yet</h3>

                <p>
                    Add your first transaction above.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML = "";


    transactions.forEach(transaction => {

        const div =
            document.createElement("div");

        div.className = "transaction";


        const icon =
            transaction.type === "income"
                ? "💰"
                : getCategoryIcon(transaction.category);


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        div.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div class="transaction-info">

                    <h3>
                        ${transaction.description}
                    </h3>

                    <p>
                        ${transaction.category}
                        •
                        ${transaction.date}
                    </p>

                </div>

            </div>


            <div class="transaction-right">

                <span class="${
                    transaction.type === "income"
                        ? "amount-income"
                        : "amount-expense"
                }">

                    ${sign}${formatMoney(transaction.amount)}

                </span>


                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">

                    🗑️

                </button>

            </div>

        `;


        list.appendChild(div);

    });

}


// ===============================
// CATEGORY ICON
// ===============================

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Travel: "🚌",

        Shopping: "🛍️",

        Bills: "💡",

        Education: "📚",

        Entertainment: "🎮",

        Health: "💊",

        Other: "📦"

    };

    return icons[category] || "📦";

}


// ===============================
// CATEGORY ANALYSIS
// ===============================

function renderCategoryChart() {

    const chart =
        document.getElementById("categoryChart");


    const expenses =
        transactions.filter(
            transaction =>
                transaction.type === "expense"
        );


    if (expenses.length === 0) {

        chart.innerHTML = `

            <p class="empty">

                Add some expenses to see
                your spending pattern.

            </p>

        `;

        return;
    }


    const categories = {};


    expenses.forEach(transaction => {

        if (!categories[transaction.category]) {

            categories[transaction.category] = 0;

        }

        categories[transaction.category]
            += transaction.amount;

    });


    const total =
        expenses.reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );


    chart.innerHTML = "";


    Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, amount]) => {

            const percentage =
                (amount / total) * 100;


            chart.innerHTML += `

                <div class="category-item">

                    <div class="category-top">

                        <span>
                            ${getCategoryIcon(category)}
                            ${category}
                        </span>

                        <strong>
                            ${formatMoney(amount)}
                        </strong>

                    </div>


                    <div class="progress">

                        <div
                            class="progress-bar"
                            style="width:${percentage}%">
                        </div>

                    </div>

                </div>

            `;

        });

}


// ===============================
// DELETE TRANSACTION
// ===============================

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );

    saveData();

    render();

}


// ===============================
// CLEAR ALL
// ===============================

document
    .getElementById("clearAll")
    .addEventListener("click", () => {

        if (transactions.length === 0) {
            return;
        }


        const confirmDelete =
            confirm(
                "Delete all transactions?"
            );


        if (confirmDelete) {

            transactions = [];

            saveData();

            render();

        }

    });


// ===============================
// MAIN RENDER
// ===============================

function render() {

    updateSummary();

    renderTransactions();

    renderCategoryChart();

}


// ===============================
// START APP
// ===============================

render();