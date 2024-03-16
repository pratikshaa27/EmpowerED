const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;
let maxSlide = slides.length - 1;

// Function to move to the next slide
function moveToSlide(slideIndex) {
  slider.style.transform = `translateX(-${slideIndex}00%)`;
  currentSlide = slideIndex;

  // Update active dot
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentSlide].classList.add("active");
}

// Function to handle next button click
nextBtn.addEventListener("click", () => {
  // Handle looping to the first slide after reaching the last slide
  if (currentSlide === maxSlide) {
    moveToSlide(0);
  } else {
    moveToSlide(currentSlide + 1);
  }
});

// Function to handle previous button click
prevBtn.addEventListener("click", () => {
  // Handle looping to the last
});