// MORPHEUS PRANK
document.addEventListener("DOMContentLoaded", function () {
    const launchImage = document.getElementById("launch-image");
    const wrapper = document.getElementById("wrapper");
    const footer = document.getElementById("footer");
  const header = document.getElementById("header-content");
  const footerWrapper = document.getElementById("footer-wrapper");
    launchImage.style.opacity = "1";
    header.style.display = "none";
    const transitionTimeout = 2000;
    setTimeout(function () {
      launchImage.style.opacity = "0";
  
      wrapper.style.display = "block";
      header.style.display = "flex";
      footer.style.display = "block";
      footerWrapper.style.display = "block";
    }, transitionTimeout);
  });