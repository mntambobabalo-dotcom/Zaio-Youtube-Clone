const canHover = window.matchMedia('(hover: hover)').matches;

if (canHover) {
  const thumbnails = document.querySelectorAll('.thumbnail');

  thumbnails.forEach(thumbnail => {
    const image = thumbnail.querySelector('.thumbnail-img');
    const video = thumbnail.querySelector('.preview-video');

    let timer = null;

    video.pause();
    video.currentTime = 0;
    video.classList.remove('active');

    thumbnail.addEventListener('mouseenter', () => {
      timer = setTimeout(() => {
        image.style.opacity = '0';

        video.classList.add('active');
        video.currentTime = 0;

        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }, 800);
    });

    thumbnail.addEventListener('mouseleave', () => {
      clearTimeout(timer);

      video.pause();
      video.currentTime = 0;
      video.classList.remove('active');

      image.style.opacity = '1';
    });
  });
}

// Lightbox / inline player for thumbnail clicks
function openLightboxWithUrl(url) {
  // remove existing lightbox if any
  const existing = document.querySelector('.lightbox');
  if (existing) existing.remove();

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => {
    if (media && media.tagName === 'VIDEO') {
      media.pause();
      media.removeAttribute('src');
      media.load();
    }
    lightbox.remove();
  });

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  let media = null;
  if (/youtu\.be|youtube/.test(url)) {
    const iframe = document.createElement('iframe');
    iframe.src = url.replace('watch?v=', 'embed/');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    media = iframe;
  } else {
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true; // ensure autoplay works in browsers
    media = video;
  }

  content.appendChild(media);
  lightbox.appendChild(content);
  lightbox.appendChild(closeBtn);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      if (media && media.tagName === 'VIDEO') {
        media.pause();
        media.removeAttribute('src');
        media.load();
      }
      lightbox.remove();
    }
  });

  document.body.appendChild(lightbox);
}

// Attach click handlers to thumbnail anchors
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.thumbnail a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      // If link points to a local video or youtube, open in lightbox instead
      if (/\.mp4$|youtube|youtu\.be/.test(href)) {
        e.preventDefault();
        openLightboxWithUrl(href);
      }
    });
  });
  // Close lightbox on Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const lb = document.querySelector('.lightbox');
      if (lb) {
        const vid = lb.querySelector('video');
        if (vid) {
          vid.pause();
          vid.removeAttribute('src');
          vid.load();
        }
        lb.remove();
      }
    }
  });
});