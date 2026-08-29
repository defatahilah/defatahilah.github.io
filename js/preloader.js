(function () {
  if (sessionStorage.getItem("hasVisitedProgrise")) {
    document.documentElement.classList.add("has-authorized");
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  const percentEl = document.getElementById("percent");
  const preloader = document.querySelector(".zero-one-preloader");
  const statusTag = document.querySelector(".status-tag");

  if (sessionStorage.getItem("hasVisitedProgrise")) {
    if (preloader) preloader.remove();
    return;
  }

  const sfx = new Audio("assets/sounds/authorize_sfx.mp3");
  sfx.preload = "auto";
  sfx.volume = 0.35;
  sfx.load();

  if (!preloader) return;

  preloader.addEventListener("click", function () {
    if (statusTag) {
      statusTag.innerText = "PROCESSING";
      statusTag.style.animation = "none";
    }

    let count = 0;
    const counterInterval = setInterval(() => {
      const nextCount = Math.min(count + (count > 80 ? 2 : 1), 100);
      count = nextCount;

      if (percentEl) {
        percentEl.innerText = count < 10 ? "0" + count : count;
      }

      if (count >= 100) {
        clearInterval(counterInterval);

        if (statusTag) {
          statusTag.innerText = "AUTHORIZED";
        }

        try {
          sfx.pause();
          sfx.currentTime = 0;
          sfx.play().catch(() => {});
        } catch (error) {
          console.log("Audio preloader error:", error);
        }

        setTimeout(() => {
          if (preloader) preloader.classList.add("loaded");

          setTimeout(() => {
            sessionStorage.setItem("hasVisitedProgrise", "true");
            document.documentElement.classList.add("has-authorized");
            if (preloader) preloader.remove();
          }, 800);
        }, 900);
      }
    }, 20);
  }, { once: true });
});