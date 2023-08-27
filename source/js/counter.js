(() => {
  const time = 2500;
  const counters = document.getElementsByClassName("cook__quantity");
  const cookSection = document.querySelector(".cook");

  let isCountersStart = false;

  window.addEventListener("scroll", function () {
    scrollSection(cookSection);
  });

  function scrollSection(target) {
    let targetPosition = {
      top: window.scrollY + target.getBoundingClientRect().top,
      bottom: window.scrollY + target.getBoundingClientRect().bottom,
    };

    let windowPosition = {
      top: window.scrollY,
      bottom: window.scrollY + document.documentElement.clientHeight,
    };

    if (targetPosition.top < windowPosition.bottom && !isCountersStart) {
      [...counters].forEach(startCount);
      isCountersStart = true;
    } else if (targetPosition.top > windowPosition.bottom || targetPosition.bottom < windowPosition.top) {
      isCountersStart = false;
    }
  }

  function startCount(counter) {
    let value = 0;
    let valueEnd = Number(counter.dataset.value);
    let step = time / valueEnd;
    let interval = setInterval(() => {
      if (value < valueEnd) value = value + 1;
      else clearInterval(interval);

      counter.innerHTML = value;
    }, step);
  }
})();
