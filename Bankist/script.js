"use strict";

// Data
const account1 = {
  owner: "Umesh Siddarth",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Nero Kutty",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Jim Jose Senior",
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Raja Shankar",
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Transaction history
const displayTransactions = function (account) {
  containerMovements.innerHTML = "";
  account.transactions.forEach(function (trans, i) {
    const type = trans > 0 ? "deposit" : "withdrawal";

    const html =
      type === "withdrawal"
        ? `
        <div class="movements__row">
            <div class = "movements__type movements__type--${type}">
            ${i + 1} ${type} </div>
            <div class = "movements__value--${type}">INR ${Math.abs(
            trans
          )}</div>
        </div> 
        `
        : `
        <div class="movements__row">
            <div class = "movements__type movements__type--interest">
            ${i + 1} INTEREST </div>
            <div class = "movements__value--${type}">INR ${
            (trans * account.interestRate) / 100
          }</div>
        </div> 
        <div class="movements__row">
            <div class = "movements__type movements__type--${type}">
            ${i + 1} ${type} </div>
            <div class = "movements__value--${type}">INR ${Math.abs(
            trans
          )}</div>
        </div> 
        
        `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displaySummary = function (account) {
  const income = account.transactions
    .filter((trans) => trans > 0)
    .reduce((acc, cur) => (acc += cur), 0);

  const outgoing = Math.abs(
    account.transactions
      .filter((trans) => trans < 0)
      .reduce((acc, cur) => (acc += cur), 0)
  );
  // This bank provides interest of 3% for every deposit.
  const interest = account.transactions
    .filter((trans) => trans > 0)
    .filter((dep) => dep >= 1)
    .map((dep) => (dep * account.interestRate) / 100)
    .reduce((acc, cur) => (acc += cur), 0);

  account.balance =
    account.transactions.reduce((acc, cur) => acc + cur, 0) + interest;

  labelSumIn.textContent = `INR ${income}`;
  labelSumOut.textContent = `INR ${outgoing}`;
  labelSumInterest.textContent = `INR ${interest}`;
  labelBalance.textContent = `INR ${account.balance}`;
};

// Computing Usernames
// Test
// const user = "Umesh Siddarth";
// const username = user
//   .toLowerCase()
//   .split(" ")
//   .map(function (el) {
//     // return el.slice(0, 1);
//     return el[0];
//   })
//   .join("");
// console.log(username);

// No need to return anything. We are just creating side effects with forEach
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);
// console.log(accounts);

// Calculate the balance

// const calcBalance = function (account) {
//   const balance = account.transactions.reduce((acc, cur) => acc + cur, 0);
//   return balance + Number(labelSumInterest.textContent);
// };

// calcBalance(account2.transactions);
// console.log(accounts);

function updateUI(account) {
  // Display transactions
  displayTransactions(account);

  // Display Summary and balance
  displaySummary(account);
}

// Implementing Login Functionality
let activeAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  activeAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // Display Welcome message
  if (activeAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      activeAccount.owner.split(" ")[0]
    }`;

    // Clear Fields
    // inputLoginUsername.value = "";
    // inputLoginPin.value = "";
    // // The above line is equivalent to
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // This will remove the focus on the pin box.

    //  Display account details
    containerApp.style.opacity = 100;

    updateUI(activeAccount);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Try Again`;
  }
});

// Implementing Transfers
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log("Click");
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= activeAccount.balance &&
    receiverAcc.username !== activeAccount.username
  ) {
    activeAccount.transactions.push(-amount);
    receiverAcc.transactions.push(amount);
    updateUI(activeAccount);
  } else {
    console.log(`Invalid Attempt`);
  }
});
