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
