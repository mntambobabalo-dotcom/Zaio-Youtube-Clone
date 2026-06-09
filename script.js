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