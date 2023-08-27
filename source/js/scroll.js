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
