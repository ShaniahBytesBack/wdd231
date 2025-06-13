// Visitor message logic
const visitMsg = document.getElementById('visit-message');
const lastVisit = localStorage.getItem('lastVisit');
const now = Date.now();

function getVisitMessage() {
  if (!lastVisit) {
    return "👋 Welcome! Let us know if you have any questions.";
  }
  const days = Math.floor((now - Number(lastVisit)) / (1000 * 60 * 60 * 24));
  if (days < 1) {
    return "Back so soon! Awesome!";
  } else if (days === 1) {
    return "You last visited 1 day ago.";
  } else {
    return `You last visited ${days} days ago.`;
  }
}
visitMsg.textContent = getVisitMessage();
localStorage.setItem('lastVisit', now);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadAttractions() {
  const grid = document.getElementById('discover-grid');
  try {
    const response = await fetch('data/discover.json');
    const attractions = await response.json();

    shuffle(attractions); 

    attractions.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'discover-card card-hidden'; 

      const h2 = document.createElement('h2');
      h2.textContent = item.name;

      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.width = 300;
      img.height = 200;
      img.loading = "lazy";
      figure.appendChild(img);

      const address = document.createElement('address');
      address.textContent = item.address;

      const desc = document.createElement('p');
      desc.textContent = item.description;

      const btn = document.createElement('button');
      btn.textContent = "Learn More";
      btn.onclick = () => window.open(item.link, '_blank');

      card.append(h2, figure, address, desc, btn);
      grid.appendChild(card);
    });

    animateCardsOnScroll();

  } catch (e) {
    grid.innerHTML = "<p>Sorry, we couldn't load the attractions right now.</p>";
  }
}
loadAttractions();

function addHoverEffect() {
  if (window.innerWidth > 640) {
    document.addEventListener('mouseover', function(e) {
      if (e.target.tagName === 'IMG' && e.target.parentElement.tagName === 'FIGURE') {
        e.target.classList.add('img-hover');
      }
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.tagName === 'IMG' && e.target.parentElement.tagName === 'FIGURE') {
        e.target.classList.remove('img-hover');
      }
    });
  }
}
addHoverEffect();
window.addEventListener('resize', addHoverEffect);

function animateCardsOnScroll() {
  const cards = document.querySelectorAll('.discover-card');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach(card => observer.observe(card));
}

const backToTopBtn = document.createElement('button');
backToTopBtn.textContent = "↑ Top";
backToTopBtn.id = "backToTop";
backToTopBtn.style.position = "fixed";
backToTopBtn.style.bottom = "32px";
backToTopBtn.style.right = "32px";
backToTopBtn.style.display = "none";
backToTopBtn.style.background = "#1e90ff";
backToTopBtn.style.color = "#fff";
backToTopBtn.style.border = "none";
backToTopBtn.style.borderRadius = "50%";
backToTopBtn.style.width = "48px";
backToTopBtn.style.height = "48px";
backToTopBtn.style.fontSize = "1rem";
backToTopBtn.style.boxShadow = "0 2px 8px #1e90ff33";
backToTopBtn.style.cursor = "pointer";
backToTopBtn.style.zIndex = "1000";
backToTopBtn.style.transition = "opacity 0.3s";

backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
    backToTopBtn.style.opacity = "1";
  } else {
    backToTopBtn.style.opacity = "0";
    setTimeout(() => {
      if (window.scrollY < 300) backToTopBtn.style.display = "none";
    }, 300);
  }
});