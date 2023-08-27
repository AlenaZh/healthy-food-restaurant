(() => {
  const carouselList = document.querySelector(".carousel__list");
  const carouselItems = carouselList.getElementsByClassName("carousel__item");
  const carouselButtonPrev = document.querySelector(".carousel__button--prev");
  const carouselButtonNext = document.querySelector(".carousel__button--next");
  const carouselIndicators = document.getElementsByClassName("carousel__indicator");

  let index = 1;              // Индекс слайда, отображаемого по умолчанию
  let translateValue = -100;  // Начальное значение позиции "carousel__list" по горизонтали в %
  let endTranslateValue = 0;
  let allowMove = true;        // Разрешено перелистывание слайдера
  let posXStart, posXEnd, posYStart, posYEnd;
  let isScrollPage = true;     // Пользователь пытается прокрутить страницу

  document.addEventListener("DOMContentLoaded", function () {
    //Клонируем первый и последний слайд
    let firstItem = carouselItems[0].cloneNode(true);
    let lastItem = carouselItems[carouselItems.length - 1].cloneNode(true);

    carouselList.prepend(lastItem);   //Вставляем копию последнего слайда в начало    
    carouselList.append(firstItem);   //Вставляем копию первого слайда в конец

    carouselList.style.transform = `translateX(${translateValue}%)`;
  });

  carouselList.addEventListener("transitionend", checkIndex);

  // Обработчик события "click" для кнопки "Previous slide"
  carouselButtonPrev.addEventListener("click", function () {
    moveSlide(-1);
  });

  // Обработчик события "click" для кнопки "Next slide"
  carouselButtonNext.addEventListener("click", function () {
    moveSlide(1);
  });

  // Добавление обработчиков событий касания
  carouselList.addEventListener("touchstart", dragStart);      // при первом касании
  carouselList.addEventListener("touchmove", dragAction);      // во время движения пальцем по элементу
  carouselList.addEventListener("touchend", dragEnd, false);   // после окончания прикосновения

  // Переключение слайда (прокручивание эл-та "carousel__list")
  function moveSlide(direction) {
    carouselList.classList.add("carousel__list--allow-move");
    if (allowMove) {
      translateValue = -100 * direction + translateValue;
      carouselList.style.transform = `translateX(${translateValue}%)`;

      if (direction == 1) {
        index++;
      } else if (direction == -1) {
        index--;
      }

      // Переключение индикаторов
      [...carouselIndicators]
        .find(function (element) {
          return element.classList.contains("carousel__indicator--active");
        })
        .classList.remove("carousel__indicator--active");

      carouselIndicators[(index + 3) % 4].classList.add("carousel__indicator--active");
    }

    allowMove = false;
  }

  /* Проверка индекса текущего слайда
     Если индекс "0", т.е. текущий слайд - это копия последнего слайда, то прокручиваем "carousel__list" на предпоследний слайд (индекс "carouselItems.length - 2")
     Если индекс "carouselItems.length - 1", т.е. текущий слайд - это копия первого слайда, то прокручиваем "carousel__list" на второй слайд (индекс "1")
  */
  function checkIndex() {
    carouselList.classList.remove("carousel__list--allow-move");

    if (index == 0) {
      index = carouselItems.length - 2;
    }

    if (index == carouselItems.length - 1) {
      index = 1;
    }

    translateValue = -100 * index;
    carouselList.style.transform = `translateX(${translateValue}%)`;

    allowMove = true;
  }

  function dragStart(e) {
    endTranslateValue = translateValue;
    posXStart = e.touches[0].clientX;
    posYStart = e.touches[0].clientY;
  }

  function dragAction(e) {
    let widthSlide = carouselItems[0].offsetWidth; // Ширина одного слайда
    e.preventDefault();

    posXEnd = posXStart - e.touches[0].clientX;
    posYEnd = posYStart - e.touches[0].clientY;
   
    if (isScrollPage) {
      // Определяем, пытается ли пользователь прокрутить страницу, а не слайдер
      // Если изменение координаты Y перемещения пальца было больше, чем изменение коодинаты X, значит пользователь пытался прокрутить страницу
      if (Math.abs(posYEnd) > Math.abs(posXEnd)) {      
        carouselList.removeEventListener("touchmove", dragAction); // То удаляем обработчик события
        return;
      }
   
      isScrollPage = false;
    }

    posXStart = e.touches[0].clientX; 
     endTranslateValue = endTranslateValue - (posXEnd * 100) / widthSlide;
    carouselList.style.transform = `translateX(${endTranslateValue}%)`;
  }

  function dragEnd() {
    if (isScrollPage) {  // Если пользователь закончил пытаться прокручивать страницу, а не слайдер
         carouselList.addEventListener("touchmove", dragAction); // То добавляем обработчик события
    } else {
      let shiftValue = translateValue - endTranslateValue; // Расчет величины сдвига элемента "carousel__list"
      if (shiftValue > 20) {            // Величина сдвига больше 20% (свайп влево на величину > 20%, = следующий слайд)
        moveSlide(1);
      } else if (shiftValue < -20) {    // Величина сдвига -20% (свайп право на величину > 20%, = предыдущий слайд)
        moveSlide(-1);
      } else {                          // Элемент "carousel__list" возвращается в начальное положение
        moveSlide(0);
      }
    }
    
    isScrollPage = true;    
  }
})();

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

(() => {
  const headerBurgerButton = document.querySelector(".header__burger");
  const headerNavigation = document.querySelector(".header__navigation");
  const headerCloseButton = document.querySelector(".navigation__close");
  const headerNavigationLinks = document.getElementsByClassName("navigation__link");

  const navigationHandler = () => {
    if (headerNavigation.classList.contains("navigation--opened")) {
      headerNavigation.classList.remove("navigation--opened");
      headerNavigation.classList.add("navigation--closed");
    } else {
      headerNavigation.classList.remove("navigation--closed");
      headerNavigation.classList.add("navigation--opened");
    }
  };

  headerBurgerButton.addEventListener("click", navigationHandler);
  headerCloseButton.addEventListener("click", navigationHandler);

  [...headerNavigationLinks].forEach(function (link) {
    link.addEventListener("click", navigationHandler);
  });
})();

(() => {
  const anchors = document.querySelectorAll('a[href*="#"]');

  [...anchors].forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const blockID = anchor.getAttribute("href").substring(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
})();
