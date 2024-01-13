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

// ---------------------------------------------------------------------------------------------------------

// Menu Fade Animation
const nav = document.querySelector(".nav");

function handleHover(e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const clicked = e.target;
    const siblings = clicked.closest("nav").querySelectorAll(".nav__link");
    const logo = clicked.closest("nav").querySelector("img");

    siblings.forEach((navLink) => {
      if (navLink !== clicked) {
        navLink.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
}

nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});

// First unoptimized code
// nav.addEventListener("mouseover", (e) => {
// if (e.target.classList.contains("nav__link")) {
//   const clicked = e.target;
//   const siblings = clicked.closest(".nav").querySelectorAll(".nav__link");
//   const logo = clicked.closest("nav").querySelector("img");
//   siblings.forEach((navLink) => {
//     if (navLink !== clicked) navLink.style.opacity = 0.5;
//   });
//   logo.style.opacity = 0.5;
// }
// });
// mouseover is similar to mouseenter where mouseenter don't bubble and mouseover bubbles.
// nav.addEventListener("mouseout", (e) => {
// if (e.target.classList.contains("nav__link")) {
//   const clicked = e.target;
//   const siblings = clicked.closest("nav").querySelectorAll(".nav__link");
//   const logo = clicked.closest("nav").querySelector("img");
//   siblings.forEach((navLink) => {
//     if (navLink !== clicked) {
//       navLink.style.opacity = 1;
//     }
//   });
//   logo.style.opacity = 1;
// }
// });

// ---------------------------------------------------------------------------------------------------------

// Implement Sticky navigation
// Using Scroll event to perform certain action on a page leads to bad performance as the system tracks scroll event very rapidly.
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   } else if (this.window.scrollY < initialCoords.top) {
//     nav.classList.remove("sticky");
//   }
// });

// Better way to implement sticky navigation (Intersection Observer API)
// We implement Observer on header as we need to make the menu sticky when the header element is out of viewport.
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect();

const stickyNav = function (entries) {
  const [entry] = entries; // Or we can use entries.forEach((entry) => {})
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});
headerObserver.observe(header);

// ---------------------------------------------------------------------------------------------------------

// Revealing sections on Scroll (Intersection Observer API)
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries; // Or we can use entries.forEach((entry) => {})
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden"); // We are doing this here instead of HTML page because some users might have disabled JS on their browser and there won't be a way to remove later.
});

// ---------------------------------------------------------------------------------------------------------

// Lazy Loading Images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries; // Or we can use entries.forEach((entry) => {})
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  // JS replaces the image at the backend and emit a load event. So we can listen to that event and remove the blur effect
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach((img) => imgObserver.observe(img));

// -------------------------------------------------------------------------------------------

// Slider Component
const slides = document.querySelectorAll(".slide");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");
let currentSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach((el, i) => {
    el.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDots(currentSlide);
};
// slides.forEach((el, i) => {
//   el.style.transform = `translateX(${i * 100}%)`;
// });
// Instead of the above cose we can use

sliderBtnRight.addEventListener("click", nextSlide);
sliderBtnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevSlide();
  e.key === "ArrowRight" && nextSlide(); //Showrt-circuting Method
});

// Creating Pagination
const dotContainer = document.querySelector(".dots");
const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide = '${i}'></button>`
    );
  });
};

const activateDots = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDots(slide);
  }
});

const init = () => {
  goToSlide(0);
  createDots();
  activateDots(0);
};
init();
