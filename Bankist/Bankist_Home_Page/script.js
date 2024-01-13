"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

// Opening a pop up form and closing it
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

//Even the btnsOpenModal is a node list foreach works for that as well
btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// -----------------------------------------------------------------------------------

// Smooth Scrolling
// Old School way
const buttonScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

// buttonScrollTo.addEventListener("click", (e) => {
//   const s1coords = section1.getBoundingClientRect();

//   window.scrollTo({
//     left: s1coords.left + window.scrollX,
//     top: s1coords.top + window.scrollY,
//     behavior: "smooth",
//   });
// });

// New Way
buttonScrollTo.addEventListener("click", (e) => {
  section1.scrollIntoView({ behavior: "smooth" });
});

// --------------------------------------------------------------------------------------------

// Page Navigation

// This method is not optimized.

// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href"); // Using getAttribute instead of direct href is because we don't need the full URL
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// What if we have 100s of element? We cannot create 100 functions to do the same job. So we use Event delegation.
// Here we added one bif event Handler to the parent element and determine the target element and do what is required.

document.querySelector(".nav__links").addEventListener("click", function (e) {
  // Matching Strategy
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// -----------------------------------------------------------------------------------------

// Tabbed Component
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab"); // Here when we click the numbers 01 or 02 the span element was clicked, but we need the buttons to be clicked. Simple e.target.parent won't work here as when we click button it select's button's parent element. So we use e.target.closest('') to get the button element always.

  // When we click the tab area it returns null.
  // Guard Clause
  if (!clicked) return;

  // Active Tab
  tabs.forEach((btn) => {
    btn.classList.remove("operations__tab--active");
  });
  clicked.classList.add("operations__tab--active");

  // Active Content Area
  // Here we make use of Dataset which is data-tab attribute or attributes with data- prefix
  tabsContent.forEach((tabContent) => {
    tabContent.classList.remove("operations__content--active");
  });
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});
