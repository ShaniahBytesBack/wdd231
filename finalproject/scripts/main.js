document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // lower is faster

  counters.forEach(counter => {
    const animate = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = Math.ceil(target / speed);

      if (count < target) {
        counter.innerText = count + increment;
        setTimeout(animate, 20);
      } else {
        counter.innerText = target;
      }
    };
    animate();
  });

  // Gallery Preview Rotator
  const galleryImages = [
    "images/gallery1.png",
    "images/gallery2.png",
    "images/gallery3.png",
    "images/gallery4.png",
    "images/gallery5.png",
    "images/gallery6.png"
  ];

  // Shuffle and pick 3 unique images
  function getRandomImages(arr, n) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  const previewImgs = getRandomImages(galleryImages, 3);
  for (let i = 0; i < 3; i++) {
    const imgEl = document.getElementById(`gallery-img-${i+1}`);
    if (imgEl) {
      imgEl.src = previewImgs[i];
      imgEl.alt = `Gallery preview ${i+1}`;
    }
  }
});