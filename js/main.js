(function ($) {
  "use strict";

  // Navbar on scrolling
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".navbar").fadeIn("slow").css("display", "flex");
    } else {
      $(".navbar").fadeOut("slow").css("display", "none");
    }
  });

  // Smooth scrolling on the navbar links
  $(".navbar-nav a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      $("html, body").animate(
        {
          scrollTop: $(this.hash).offset().top - 45,
        },
        1500,
        "easeInOutExpo"
      );

      if ($(this).parents(".navbar-nav").length) {
        $(".navbar-nav .active").removeClass("active");
        $(this).closest("a").addClass("active");
      }
    }
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Scroll to Bottom
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".scroll-to-bottom").fadeOut("slow");
    } else {
      $(".scroll-to-bottom").fadeIn("slow");
    }
  });

  // Portfolio isotope and filter
  var portfolioIsotope = $(".portfolio-container").isotope({
    itemSelector: ".portfolio-item",
    layoutMode: "fitRows",
  });
  $("#portfolio-flters li").on("click", function () {
    $("#portfolio-flters li").removeClass("active");
    $(this).addClass("active");

    portfolioIsotope.isotope({ filter: $(this).data("filter") });
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  $(".gallery-carousel").owlCarousel({
    autoplay: true,
    autoplayTimeout: 3000, // tiempo entre slides (ms)
    autoplayHoverPause: true, // se pausa si el usuario interactúa
    smartSpeed: 1500, // suavidad de la animación
    slideBy: 1, // avanza de a 1 slide
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  });

  const track = document.querySelector(".ccarousel-track");
  const slides = document.querySelectorAll(".sslide");
  const videos = document.querySelectorAll("video");
  // const videos = document.querySelectorAll('video'); aumentar vv
  const prevBtn = document.querySelector(".pprev");
  const nextBtn = document.querySelector(".nnext");

  let index = 0;
  let startX = 0;
  let autoSlide;
  const delay = 5000;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;

    videos.forEach((video, i) => {
      if (i === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  function startAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      index = (index + 1) % slides.length;
      updateCarousel();
    }, delay);
  }

  prevBtn.onclick = () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
    startAutoSlide();
  };

  nextBtn.onclick = () => {
    index = (index + 1) % slides.length;
    updateCarousel();
    startAutoSlide();
  };

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) index = (index + 1) % slides.length;
    if (endX - startX > 50) index = (index - 1 + slides.length) % slides.length;

    updateCarousel();
    startAutoSlide();
  });

  updateCarousel();
  startAutoSlide();
})(jQuery);
