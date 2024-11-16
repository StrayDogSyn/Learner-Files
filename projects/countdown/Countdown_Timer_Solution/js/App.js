const day = document.getElementById("cDay");
const hour = document.getElementById("cHr");
const minute = document.getElementById("cMin");
const second = document.getElementById("cSec");
const allTimers = [
  second,
  second.firstElementChild,
  minute,
  minute.firstElementChild,
  hour,
  hour.firstElementChild,
  day,
  day.firstElementChild,
];

const countDownDate = new Date("Feb 22, 2021").getTime();

const dayCount = document.querySelectorAll(".day");
const hrCount = document.querySelectorAll(".hr");
const minCount = document.querySelectorAll(".min");
const secCount = document.querySelectorAll(".sec");

window.addEventListener("DOMContentLoaded", () => {
  const countDown = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    dayCount.forEach((el) => {
      el.innerText = days < 10 ? `0${days}` : days;
    });
    hrCount.forEach((el) => {
      el.innerText = hours < 10 ? `0${hours}` : hours;
    });
    minCount.forEach((el) => {
      el.innerText = minutes < 10 ? `0${minutes}` : minutes;
    });
    secCount.forEach((el) => {
      el.innerText = seconds < 10 ? `0${seconds}` : seconds;
    });

    if (distance <= 0) {
      clearInterval(countDown);
      dayCount.forEach((el) => {
        el.innerText = "00";
      });
      hrCount.forEach((el) => {
        el.innerText = "00";
      });
      minCount.forEach((el) => {
        el.innerText = "00";
      });
      secCount.forEach((el) => {
        el.innerText = "00";
      });
    }
  }, 1000);

  const animation = setTimeout(() => {
    setInterval(() => {
      allTimers.map((el) => {
        el.classList.remove("active");
      });

      if (secCount[0].innerText) {
        second.classList.add("active");
        second.firstElementChild.classList.add("active");
      }

      if (secCount[0].innerText === "00") {
        minute.classList.add("active");
        minute.firstElementChild.classList.add("active");
      }

      if (minCount[0].innerText === "00" && secCount[0].innerText === "00") {
        hour.classList.add("active");
        hour.firstElementChild.classList.add("active");
      }

      if (
        hrCount[0].innerText === "00" &&
        minCount[0].innerText === "00" &&
        secCount[0].innerText === "00"
      ) {
        day.classList.add("active");
        day.firstElementChild.classList.add("active");
      }
    }, 1000);
  }, 500);
});
