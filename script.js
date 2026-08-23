/* Elements */
const frames = document.querySelectorAll('.painting-frame');
const paintings = document.querySelectorAll('.painting');
const ambient = document.querySelector('.ambient-sound');
const soundToggle = document.querySelector('.sound-toggle');
const lightning = document.querySelector('.lightning-flash');
const bgVideos = document.querySelectorAll('.bg-video');
const sections = document.querySelectorAll('.painting-section');

/* Block right-click and drag-save on the paintings */
paintings.forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
  img.addEventListener('dragstart', e => e.preventDefault());
});

/* Background video switching */
const videoMap = {};
bgVideos.forEach(v => { videoMap[v.dataset.src] = v; });

let currentActiveSrc = null;

function activateVideo(src, speed) {
  if (!src || src === currentActiveSrc || !videoMap[src]) return;
  const nextVideo = videoMap[src];
  nextVideo.playbackRate = speed;
  nextVideo.play();
  bgVideos.forEach(v => v.classList.remove('active'));
  nextVideo.classList.add('active');
  currentActiveSrc = src;
}

const firstSection = sections[0];
activateVideo(firstSection.dataset.video, parseFloat(firstSection.dataset.speed) || 1);

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activateVideo(entry.target.dataset.video, parseFloat(entry.target.dataset.speed) || 1);
    }
  });
}, { threshold: 0.6, rootMargin: '30% 0px' });

sections.forEach(section => videoObserver.observe(section));

/* Ambient sound toggle */
let soundOn = false;

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  ambient.muted = !soundOn;
  if (soundOn) ambient.play();
  soundToggle.classList.toggle('muted', !soundOn);
  soundToggle.style.opacity = soundOn ? '1' : '0.4';
});

/* Painting frame fade-in */
frames.forEach(frame => {
  frame.style.opacity = 0;
  frame.style.transform = 'scale(0.9)';
  frame.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
});

const frameObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const visible = entry.isIntersecting;
    entry.target.style.opacity = visible ? 1 : 0;
    entry.target.style.transform = visible ? 'scale(1)' : 'scale(0.9)';
  });
}, { threshold: 0.5 });

frames.forEach(frame => frameObserver.observe(frame));

/* Random lightning flash */
function triggerLightning() {
  lightning.style.transition = 'none';
  lightning.style.opacity = '0.8';

  setTimeout(() => {
    lightning.style.transition = 'opacity 0.1s ease';
    lightning.style.opacity = '0';
  }, 60);

  setTimeout(() => {
    lightning.style.transition = 'none';
    lightning.style.opacity = '0.5';
  }, 200);

  setTimeout(() => {
    lightning.style.transition = 'opacity 0.3s ease';
    lightning.style.opacity = '0';
  }, 260);
}

function scheduleLightning() {
  const delay = 15000 + Math.random() * 45000;
  setTimeout(() => {
    triggerLightning();
    scheduleLightning();
  }, delay);
}

scheduleLightning();
