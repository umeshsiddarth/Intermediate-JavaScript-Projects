"use strict";

// Data
const account1 = {
  owner: "Umesh Siddarth",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-07-12T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Nero Kutty",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

// const account3 = {
//   owner: "Jim Jose Senior",
//   transactions: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Raja Shankar",
//   transactions: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

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

// Transaction history and sorting
const displayTransactions = function (account, sort = false) {
  containerMovements.innerHTML = "";

  const trans = sort
    ? account.transactions.slice().sort((cur, next) => cur - next)
    : account.transactions;
  // Here we use slice to make a shallow copy of an array as we don't want to mutate the original array. Instead of spread operator we use slice to chain methods.
  trans.forEach(function (trans, i) {
    const type = trans > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = `${date.getFullYear()}`;
    const displayDate = `${day}/${month}/${year}`;
    const html =
      type === "withdrawal"
        ? `
        <div class="movements__row">
            <div class = "movements__type movements__type--${type}">
            ${i + 1} ${type} </div>
            <div class = 'movements_date'>${displayDate}</div>
            <div class = "movements__value--${type}">INR ${Math.abs(
            trans
          )}</div>
        </div> 
        `
        : `
        <div class="movements__row">
            <div class = "movements__type movements__type--interest">
            ${i + 1} INTEREST </div>
            <div class = 'movements_date'>${displayDate}</div>
            <div class = "movements__value--${type}">INR ${
            (trans * account.interestRate) / 100
          }</div>
        </div> 
        <div class="movements__row">
            <div class = "movements__type movements__type--${type}">
            ${i + 1} ${type} </div>
            <div class = 'movements_date'>${displayDate}</div>
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

  labelSumIn.textContent = `INR ${income.toFixed(2)}`;
  labelSumOut.textContent = `INR ${outgoing.toFixed(2)}`;
  labelSumInterest.textContent = `INR ${interest.toFixed(2)}`;
  labelBalance.textContent = `INR ${account.balance.toFixed(2)}`;
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
console.log(accounts);

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

    activeAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(activeAccount);
  } else {
    console.log(`Invalid Attempt`);
  }
});

// Loan Request (Bank provides loan only if there is atleast 1 deposit and the deposit should be atleast 10% of the requested loan amount)
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const reqLoan = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = "";
  if (
    reqLoan > 0 &&
    activeAccount.transactions.some((trans) => trans >= reqLoan * 0.1)
  ) {
    activeAccount.transactions.push(reqLoan);
    activeAccount.movementsDates.push(new Date().toISOString());
    updateUI(activeAccount);
  } else {
    console.log("Loan Rejected");
  }
});

// Closing Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  inputClosePin.blur();
  if (
    inputCloseUsername.value === activeAccount.username &&
    Number(inputClosePin.value) === activeAccount.pin
  ) {
    const accToDel = accounts.findIndex(
      (acc) => acc.username === activeAccount.username
    );
    accounts.splice(accToDel, 1);
    // inputCloseUsername.value = inputClosePin.value = "";
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `${
      activeAccount.owner.split(" ")[0]
    }'s Account Deleted`;
  } else {
    console.log("Cannot delete other accounts");
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

// sorting
let sorted = false; // We are using a state variable to remember the state of the sort.
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayTransactions(activeAccount, !sorted);
  sorted = !sorted;
});

// * Exploring Array.from method. This is not working

// labelBalance.addEventListener("click", function () {
//   let transactionsUI = Array.from(
//     document.querySelectorAll(".movements__value")
//   );
//   console.log(transactionsUI);
// });

// h1 More practice on Arrays
// Calculate all the deposits

// const bankDepositSum = accounts
//   .map((el) => {
//     return el.transactions;
//   })
//   .flat();

// ! OR
const bankDepositSum = accounts
  .flatMap((el) => {
    return el.transactions;
  })
  .filter((el) => el > 0)
  .reduce((acc, cur) => {
    return acc + cur;
  }, 0);
console.log(bankDepositSum);

// Implementing Dates:
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();

labelDate.textContent = `${day}/${month}/${year}`;
