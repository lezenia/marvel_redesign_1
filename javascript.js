jQuery(document).ready();

$(".img-slide a:gt(0)").hide();
setInterval(function () {
  $(".img-slide a:first")
    .fadeOut()
    .next("a")
    .fadeIn()
    .end()
    .appendTo(".img-slide");
}, 3000);

$(function () {
  $(".navi > li")
    .mouseover(function () {
      $(this).find(".sub-menu").stop().slideDown(300);
    })
    .mouseout(function () {
      $(this).find(".sub-menu").stop().slideUp(300);
    });
});

// 스크롤 트리거 플러그인 활성화
gsap.registerPlugin(ScrollTrigger);

console.clear();

var $window = $(window);
var windowWidth = $window.width();
var windowHeight = $window.height();

$window.resize(function () {
  windowWidth = $(window).width();
  windowHeight = $window.height();
});

function setTimelineToEl(timeline, $el) {
  $el.data("gsap-timeline", timeline);
}

function killTimeline($el) {
  var timeline = $el.data("gsap-timeline");

  if (timeline) {
    timeline.kill();
  }
}

function SectionTop__init() {
  var $contentLi = $(".section-top__content > li");
  var $bgLi = $(".section-top__bg > li");
  var $bgLiChild = $bgLi.find(" > div");

  var animationDuration = 600;

  var updateBgLiChildWidth = function () {
    var width = windowWidth;
    $bgLiChild.stop().width(width);
  };

  $window.resize(function () {
    updateBgLiChildWidth();
  });
  updateBgLiChildWidth();

  $contentLi.mouseenter(function () {
    var $this = $(this);
    var index = $this.index();
    var $selectedBgLi = $bgLi.eq(index);
    var $selectedBgLiChild = $bgLiChild.eq(index);

    $selectedBgLi.addClass("active");

    var timeline = gsap.timeline();

    setTimelineToEl(timeline, $selectedBgLiChild);
    setTimelineToEl(timeline, $selectedBgLi);

    var animationDurationSeconds = animationDuration / 1000;

    timeline.to($selectedBgLiChild, {
      left: 0,
      duration: animationDurationSeconds,
    });

    timeline.to(
      $selectedBgLi,
      {
        left: 0,
        right: 0,
        duration: animationDurationSeconds,
      },
      "-=" + animationDurationSeconds
    );
  });

  $contentLi.mouseleave(function () {
    var $this = $(this);
    var index = $this.index();
    var $selectedBgLi = $bgLi.eq(index);
    var $selectedBgLiChild = $bgLiChild.eq(index);

    $selectedBgLi.removeClass("active");

    killTimeline($selectedBgLi);
    $selectedBgLi.css({
      left: "",
      right: "",
    });

    killTimeline($selectedBgLiChild);
    $selectedBgLiChild.css({
      left: "",
    });
  });
}

SectionTop__init();

let hero = document.getElementById("hero-slides");
let menu = document.getElementById("menu");
let slides = document.getElementById("slides");
let dribbble = document.getElementById("dribbble");
let next = ["next", "next-catch"].map((n) => document.getElementById(n));
let prev = ["prev", "prev-catch"].map((n) => document.getElementById(n));
let slideChildren = slides.children;
let slideCount = slides.children.length;
let currentlyDemoing = false;
let currentPage = 0;
let slidesPerPage = () =>
  window.innerWidth > 1700 ? 4 : window.innerWidth > 1200 ? 3 : 2;
let maxPageCount = () => slideCount / slidesPerPage() - 1;

function goToPage(pageNumber = 0) {
  currentPage = Math.min(maxPageCount(), Math.max(0, pageNumber));
  console.log(currentPage);
  hero.style.setProperty("--page", currentPage);
}

function sleep(time) {
  return new Promise((res) => setTimeout(res, time));
}

function hoverSlide(index) {
  index in slideChildren && slideChildren[index].classList.add("hover");
}

function unhoverSlide(index) {
  index in slideChildren && slideChildren[index].classList.remove("hover");
}

async function demo() {
  if (currentlyDemoing) {
    return;
  }
  currentlyDemoing = true;
  if (currentPage !== 0) {
    goToPage(0);
    await sleep(800);
  }
  let slides = slidesPerPage();
  let pageSeq_ = { 2: [1, 2, 1], 3: [1, 2, 1 / 3], 4: [1, 1, 0] };
  let pageSeq = pageSeq_[slides] || pageSeq_[4];
  let slideSeq_ = { 2: [2, 4, 3], 3: [3, 6, 2], 4: [3, 6, 2] };
  let slideSeq = slideSeq_[slides] || slideSeq_[2];
  await sleep(300);
  goToPage(pageSeq[0]);
  await sleep(500);
  hoverSlide(slideSeq[0]);
  await sleep(1200);
  goToPage(pageSeq[1]);
  dribbble.classList.add("hover");
  unhoverSlide(slideSeq[0]);
  await sleep(500);
  hoverSlide(slideSeq[1]);
  await sleep(1200);
  goToPage(pageSeq[2]);
  unhoverSlide(slideSeq[1]);
  await sleep(300);
  hoverSlide(slideSeq[2]);
  await sleep(1600);
  goToPage(0);
  unhoverSlide(slideSeq[2]);
  dribbble.classList.remove("hover");
  currentlyDemoing = false;
}

next.forEach((n) =>
  n.addEventListener(
    "click",
    () => !currentlyDemoing && goToPage(currentPage + 1)
  )
);
prev.forEach((n) =>
  n.addEventListener(
    "click",
    () => !currentlyDemoing && goToPage(currentPage - 1)
  )
);
menu.addEventListener("click", demo);

sleep(100).then(demo);

// window.addEventListener('resize', () => {
// console.log(document.body.style.getPropertyValue('--slide-per-page'));
// });

/* requestAnimationFrame */

// 휠-cd모션
var wheel = Draggable.create("#wheel", {
  type: "rotation",
  throwProps: true,
  snap: function (endValue) {
    return Math.round(endValue / 90) * 90;
  },
  onDrag: function () {},
  onThrowComplete: function () {
    dragActive();
  },
});

TweenMax.set("#wheel li:not(.active) .details > *", {
  opacity: 0,
  y: -10,
});

// Calculate which product is active
function dragActive() {
  var rot = wheel[0].rotation / 360;
  var decimal = rot % 1;
  var sliderLength = $("#wheel li").length;
  var tempIndex = Math.round(sliderLength * decimal);
  var index;

  if (rot < 0) {
    index = Math.abs(tempIndex);
  } else {
    index = sliderLength - tempIndex;
  }

  if (decimal === 0) {
    index = 0;
  }

  TweenMax.staggerTo(
    "#wheel li.active .details > *",
    0.6,
    {
      opacity: 0,
      y: -10,
    },
    0.1
  );

  $("#wheel li.active").removeClass("active");
  $($("#wheel li")[index]).addClass("active");

  TweenMax.staggerTo(
    "#wheel li.active .details > *",
    0.6,
    {
      opacity: 1,
      y: 0,
    },
    0.1
  );
}

// Tween rotation
function rotateDraggable(deg, callback) {
  var rot = wheel[0].rotation;
  var tl = new TimelineMax();

  tl.to("#wheel", 0.5, {
    rotation: rot + deg,
    onComplete: function () {
      callback();
    },
  });

  wheel[0].rotation = rot + deg;
}

// Handlers
function nextHandler() {
  var current = $("#wheel li.active");
  var item = current + 1;
  if (item > $("#wheel li").length) {
    item = 1;
  }
  rotateDraggable(360 / $("#wheel li").length, dragActive);
}

function prevHandler() {
  var current = $("#wheel li.active");
  var item = current - 1;
  if (item > 1) {
    item = $("#wheel li").length;
  }
  rotateDraggable(-360 / $("#wheel li").length, dragActive);
}

$(".next").on("click", nextHandler);
$(".prev").on("click", prevHandler);

var square =
  '<svg x="0px" y="0px" width="1200px" height="600px" viewBox="0 0 1200 600"><rect x="0.002" y="0.499" width="1200" height="600"/></svg>';

//큐브
var swiper = new Swiper(".mySwiper", {
  effect: "cube",
  grabCursor: true,
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
  },
  pagination: {
    el: ".swiper-pagination",
  },
});
//큐브 텍스트
$(function () {
  $(".swiper-slide")
    .mouseover(function () {
      $(this).find(".title-contents-2").stop().fadeIn(300);
    })
    .mouseout(function () {
      $(this).find(".title-contents-2").stop().fadeOut(300);
    });
});

// 추천 코믹스
function _getClosest(item, array, getDiff) {
  var closest, diff;
  if (!Array.isArray(array)) {
    throw new Error("Get closest expects an array as second argument");
  }
  array.forEach(function (comparedItem, comparedItemIndex) {
    var thisDiff = getDiff(comparedItem, item);
    if (thisDiff >= 0 && (typeof diff == "undefined" || thisDiff < diff)) {
      diff = thisDiff;
      closest = comparedItemIndex;
    }
  });
  return closest;
}
function number(item, array) {
  return _getClosest(item, array, function (comparedItem, item) {
    return Math.abs(comparedItem - item);
  });
}
function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}
class Slider {
  constructor(options = {}) {
    this.bind();
    this.opts = {
      el: options.el || ".js-slider",
      ease: options.ease || 0.1,
      speed: options.speed || 1.5,
      velocity: 25,
      scroll: options.scroll || false,
    };
    this.slider = document.querySelector(".js-slider");
    this.sliderInner = this.slider.querySelector(".js-slider__inner");
    this.slides = [...this.slider.querySelectorAll(".js-slide")];
    this.slidesNumb = this.slides.length;
    this.rAF = undefined;
    this.sliderWidth = 0;
    this.onX = 0;
    this.offX = 0;
    this.currentX = 0;
    this.lastX = 0;
    this.min = 0;
    this.max = 0;
    this.centerX = window.innerWidth / 2;
  }
  bind() {
    ["setPos", "run", "on", "off", "resize"].forEach(
      (fn) => (this[fn] = this[fn].bind(this))
    );
  }
  setBounds() {
    const bounds = this.slides[0].getBoundingClientRect();
    const slideWidth = bounds.width;
    this.sliderWidth = this.slidesNumb * slideWidth;
    this.max = -(this.sliderWidth - window.innerWidth);
    this.slides.forEach((slide, index) => {
      slide.style.left = `${index * slideWidth}px`;
    });
  }
  setPos(e) {
    if (!this.isDragging) return;
    this.currentX = this.offX + (e.clientX - this.onX) * this.opts.speed;
    this.clamp();
  }
  clamp() {
    this.currentX = Math.max(Math.min(this.currentX, this.min), this.max);
  }
  run() {
    this.lastX = lerp(this.lastX, this.currentX, this.opts.ease);
    this.lastX = Math.floor(this.lastX * 100) / 100;
    const sd = this.currentX - this.lastX;
    const acc = sd / window.innerWidth;
    let velo = +acc;
    this.sliderInner.style.transform = `translate3d(${
      this.lastX
    }px, 0, 0) skewX(${velo * this.opts.velocity}deg)`;
    this.requestAnimationFrame();
  }
  on(e) {
    this.isDragging = true;
    this.onX = e.clientX;
    this.slider.classList.add("is-grabbing");
  }
  off(e) {
    this.snap();
    this.isDragging = false;
    this.offX = this.currentX;
    this.slider.classList.remove("is-grabbing");
  }
  closest() {
    const numbers = [];
    this.slides.forEach((slide, index) => {
      const bounds = slide.getBoundingClientRect();
      const diff = this.currentX - this.lastX;
      const center = bounds.x + diff + bounds.width / 2;
      const fromCenter = this.centerX - center;
      numbers.push(fromCenter);
    });
    let closest = number(0, numbers);
    closest = numbers[closest];
    return {
      closest,
    };
  }
  snap() {
    const { closest } = this.closest();
    this.currentX = this.currentX + closest;
    this.clamp();
  }
  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.run);
  }
  cancelAnimationFrame() {
    cancelAnimationFrame(this.rAF);
  }
  addEvents() {
    this.run();
    this.slider.addEventListener("mousemove", this.setPos, {
      passive: true,
    });
    this.slider.addEventListener("mousedown", this.on, false);
    this.slider.addEventListener("mouseup", this.off, false);
    window.addEventListener("resize", this.resize, false);
  }
  removeEvents() {
    this.cancelAnimationFrame(this.rAF);
    this.slider.removeEventListener("mousemove", this.setPos, {
      passive: true,
    });
    this.slider.removeEventListener("mousedown", this.on, false);
    this.slider.removeEventListener("mouseup", this.off, false);
  }
  resize() {
    this.setBounds();
  }
  destroy() {
    this.removeEvents();
    this.opts = {};
  }
  init() {
    this.setBounds();
    this.addEvents();
  }
}
const slider = new Slider();
slider.init();

// 인사이드
document.addEventListener("DOMContentLoaded", function () {
  var parent = document.querySelector(".splitview"),
    topPanel = parent.querySelector(".top"),
    handle = parent.querySelector(".handle"),
    skewHack = 0,
    delta = 0;

  // If the parent has .skewed class, set the skewHack var.
  if (parent.className.indexOf("skewed") != -1) {
    skewHack = 1000;
  }

  parent.addEventListener("mousemove", function (event) {
    // Get the delta between the mouse position and center point.
    delta = (event.clientX - window.innerWidth / 2) * 0.5;

    // Move the handle.
    handle.style.left = event.clientX + delta + "px";

    // Adjust the top panel width.
    topPanel.style.width = event.clientX + skewHack + delta + "px";
  });
});

// 코믹스

var Swiper = new Swiper(".swiper-container", {
  slidesPerView: 3,
  spaceBetween: 10,
  autoHeight: false,
  loop: true,
  // var Swiper = new Swiper(".swiper-container", {
  //   speed: 400,
  //   spaceBetween: 100,
  //   initialSlide: 0,
  //   //truewrapper adoptsheight of active slide
  //   autoHeight: false,
  //   // Optional parameters
  //   direction: "horizontal",
  //   loop: true,
  // delay between transitions in ms
  // autoplay: 5000,
  // autoplayStopOnLast: false, // loop false also
  // If we need pagination
  pagination: ".swiper-pagination",
  paginationType: "bullets",

  // Navigation arrows
  nextButton: ".swiper-button-next",
  prevButton: ".swiper-button-prev",

  // And if we need scrollbar
  //scrollbar: '.swiper-scrollbar',
  // "slide", "fade", "cube", "coverflow" or "flip"
  // effect: "slide",
  // Distance between slides in px.
  // spaceBetween: 60,
  //
  // slidesPerView: 2,
  //
  // centeredSlides: true,
  //
  // slidesOffsetBefore: 0,
  //
  grabCursor: true,
});

// 메뉴 게임스
const tiles = [
  {
    image: "https://i.imgur.com/f0z9Q33.png",
    thumb: "https://i.imgur.com/yTNoR98.png",
    title: "Marvel's Midnight Suns<br /><br />",
    nextTitle: "Marvel's Midnight Suns <br />1/5",
  },
  {
    image: "https://i.imgur.com/VwZXWaP.png",
    thumb: "https://i.imgur.com/z1obshw.png",
    title: "Marvel's Snap<br /><br />",
    nextTitle: "Marvel's Snap <br />2/5",
  },
  {
    image: "https://i.imgur.com/mr3ZBKT.jpg",
    thumb: "https://i.imgur.com/Z7bQVvs.png",
    title: "Guardians of the galaxy : part 3<br /><br />",
    nextTitle: "Guardians of the galaxy : part 3 <br />3/5",
  },
  {
    image: "https://i.imgur.com/dTuLY74.png",
    thumb: "https://i.imgur.com/OQdMmMa.png",
    title: "Marvel's Future fight<br /><br />",
    nextTitle: "Marvel's Future fight <br />4/5",
  },
  {
    image: "https://i.imgur.com/bU48oFz.png",
    thumb: "https://i.imgur.com/TVdMScc.png",
    title: "Contest of Champions<br /><br />",
    nextTitle: "Contest of Champions <br />5/5",
  },
];
let activeIndex = 0;
const nextButton = document.querySelector(".next-tile");
updateTileRatio();
populateInitialData();
nextButton.addEventListener("click", nextTile);

// ---------------------
// Populate initial data
// ---------------------

function populateInitialData() {
  // It would be better to target the individual elements as you can't be sure that the arrays below...
  // ...will only contain 2 items. But it's my pen and I'm sureee that there's only 2 elements ;-P
  const tileImages = document.querySelectorAll(".tile__img");
  tileImages[0].src = `${tiles[activeIndex].image}`;
  tileImages[1].src = `${tiles[getNextIndex()].image}`;
  const tileTitles = document.querySelectorAll(".title__text");
  tileTitles[0].innerHTML = tiles[activeIndex].title;
  tileTitles[1].innerHTML = tiles[getNextIndex()].title;
  const nextButtonImages = document.querySelectorAll(
    ".next-tile__preview__img"
  );
  nextButtonImages[0].src = `${tiles[getNextIndex()].thumb}`;
  nextButtonImages[1].src = `${tiles[getNextIndex(1)].thumb}`;
  const nextButtonTitles = document.querySelectorAll(".next-tile__title__text");
  nextButtonTitles[0].innerHTML = tiles[getNextIndex()].nextTitle;
  nextButtonTitles[1].innerHTML = tiles[getNextIndex(1)].nextTitle;
}

// ------------------------
// Set the tile image ratio
// ------------------------

// Why are we doing this and not just using object: cover in CSS?
// Large images, cover, Chrome, and Greensock don't play well together. On the first tile transition...
// ...you will see a noticable studder. This disappears on initial transitions but it's enough to prevent me from using it...
// If anybody knows a workaround to prevent the studder, please let me know!

function updateTileRatio() {
  const browserWidth = document.body.clientWidth;
  const browserHeight = document.body.clientHeight;
  const browserRatio = browserWidth / browserHeight;
  const imageWidth = 3000; // Yeah yeah yeah, magic numbers... let's just say this is what my spec is set to - if we have to use a different size we will find another way to get the values
  const imageHeight = 2000;
  const imageRatio = imageWidth / imageHeight;
  const tileImages = document.querySelectorAll(".tile__img");

  // This could be a bit better if we checked to see if we even need to fire the stuff below...
  // ...if the ratio is still the same with a browser resize we should just skip over all of this code. #laziness #itsjustapen

  if (browserRatio < imageRatio) {
    for (let i = 0; i < tileImages.length; i++) {
      tileImages[i].style.width = "auto";
      tileImages[i].style.height = "100%";
    }
  } else {
    for (let i = 0; i < tileImages.length; i++) {
      tileImages[i].style.width = "100%";
      tileImages[i].style.height = "auto";
    }
  }
}

// ---------------
// Screen resized!
// ---------------

window.addEventListener("resize", screenResized);

// You might want to use a debouncer or something to prevent this function from firing too many times...
// ...but for this demo we will leave it (https://davidwalsh.name/javascript-debounce-function)
function screenResized() {
  updateTileRatio();
}

// ---------------
// Title animation
// ---------------

const titleAnimation = new TimelineMax({
  paused: true,
})
  .to(
    ".title__container",
    0.8,
    {
      ease: Power2.easeOut,
      yPercent: -50,
    },
    "titleAnimation"
  )
  .to(
    ".title__text--first",
    0.5,
    {
      opacity: 0,
    },
    "titleAnimation"
  )
  .eventCallback("onComplete", () => {
    // Update the titles and reset the animation so that we could...
    // ...just play the same animation on next click
    titleAnimation.progress(0).pause();
    const titles = document.querySelectorAll(".title__text");
    titles[0].innerHTML = tiles[activeIndex].title;
    titles[1].innerHTML = tiles[getNextIndex()].title;
  });

// --------------------------
// Next tile button animation
// --------------------------

// Mixing css set properties with Greensock properties causes rendering issues...
// ...so it's best to set positioning of anything that will change using .set()
// https://greensock.com/forums/topic/20822-animation-co-ordinates-wrong-after-resize/?tab=comments#comment-97600
TweenMax.set(".next-tile__preview img", {
  top: "50%",
  right: "0",
  y: "-50%",
});
TweenMax.set(".tile__img", {
  top: "50%",
  left: "50%",
  x: "-50%",
  y: "-50%",
});
TweenMax.set(".tile__img--last", {
  scale: 1.2,
  opacity: 0.001,
}); // Setting opacity 0 here causes lag on initial play, this dissapears later on, will open a ticket and see if this is a known issue
TweenMax.set(".tile__img--first, .title__img--last", {
  yPercent: -50,
  xPercent: -50,
});
TweenMax.set(".title", {
  y: "-50%",
  width: "100%",
});
TweenMax.set(".title__container", {
  width: "100%",
});

// Text change animation
const nextTextAnimation = new TimelineMax({
  paused: true,
})
  .to(
    ".next-tile__title__text--first",
    0.4,
    {
      opacity: 0,
    },
    "textChange"
  )
  .to(
    ".next-tile__title__text--last",
    0.4,
    {
      opacity: 1,
    },
    "textChange"
  );

// Slide next tile to reveal new image
const titles = document.querySelectorAll(".next-tile__title__text");
const tileImages = document.querySelectorAll(".tile__img");
const previewImages = document.querySelectorAll(".next-tile__preview__img");
const nextButtonAnimation = new TimelineMax({
  paused: true,
})
  .to(".next-tile__details", 0.6, {
    ease: Power1.easeOut,
    xPercent: 80,
  })
  .to(
    ".tile__img--last",
    0.6,
    {
      ease: Sine.easeOut,
      opacity: 1,
      scale: 1,
    },
    0
  )
  .to(
    ".next-tile__preview__img--first",
    0,
    {
      opacity: 0,
    },
    "sliderClosed"
  )
  .to(
    ".next-tile__preview__img--last",
    0.6,
    {
      ease: Sine.easeOut,
      opacity: 1,
      scale: 1,
    },
    "sliderClosed"
  )
  .to(
    ".next-tile__details",
    0.5,
    {
      ease: Sine.easeOut,
      xPercent: 0,
    },
    "sliderClosed+=0.15"
  )
  .add(() => nextTextAnimation.play(), "-=0.5")
  .eventCallback("onComplete", () => {
    nextButtonAnimation.progress(0).pause();
    nextTextAnimation.progress(0).pause();
    tileImages[0].src = `${tiles[activeIndex].image}`;
    tileImages[1].src = `${tiles[getNextIndex()].image}`;
    previewImages[0].src = `${tiles[getNextIndex()].thumb}`;
    previewImages[1].src = `${tiles[getNextIndex(1)].thumb}`;
    titles[0].innerHTML = tiles[getNextIndex()].nextTitle;
    titles[1].innerHTML = tiles[getNextIndex(1)].nextTitle;
  });

// -------
// Helpers
// -------

function getNextIndex(skipSteps = 0) {
  let newIndex = activeIndex;
  incrementIndex();
  for (let i = 0; i < skipSteps; i++) {
    incrementIndex();
  }
  function incrementIndex() {
    if (newIndex >= tiles.length - 1) {
      newIndex = 0;
    } else {
      newIndex = newIndex + 1;
    }
  }
  return newIndex;
}

// -----------
// Tile Change
// -----------

function nextTile() {
  // We want to prevent clicking on the next tile button if an animation is active...
  // ...to prevent the animations from being interupted mid animation.
  if (
    !titleAnimation.isActive() &&
    !nextButtonAnimation.isActive() &&
    !nextTextAnimation.isActive()
  ) {
    activeIndex = getNextIndex();
    titleAnimation.play();
    nextButtonAnimation.play();
  }
}

// ------------------------------
// Initialize all timeline values
// ------------------------------

titleAnimation.progress(1).progress(0);
nextButtonAnimation.progress(1).progress(0);
nextTextAnimation.progress(1).progress(0);
