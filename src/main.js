import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal Animation
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // 2. Custom Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      // Add slight delay to outline for a trailing effect
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover effects on links/buttons
    const hoverElements = document.querySelectorAll('a, button, .magnetic, .gallery-item');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  }

  // 3. Magnetic Buttons
  const magneticButtons = document.querySelectorAll('.btn-primary, .magnetic');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // 4. ScrollSpy Navigation
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 6. Number Counter Animation
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            entry.target.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.innerText = target;
          }
        };
        updateCounter();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));

  // 7. Testimonials Carousel
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.next-btn');
  const prevButton = document.querySelector('.prev-btn');
  
  let currentIndex = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  
  const updateCarousel = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevTranslate = currentIndex * -track.offsetWidth;
  };
  
  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) currentIndex++;
    else currentIndex = 0;
    updateCarousel();
  });
  
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex--;
    else currentIndex = slides.length - 1;
    updateCarousel();
  });
  
  // Drag support for carousel
  slides.forEach((slide, index) => {
    const slideImage = slide.querySelector('img');
    if (slideImage) slideImage.addEventListener('dragstart', (e) => e.preventDefault());
    
    slide.addEventListener('pointerdown', touchStart(index));
    slide.addEventListener('pointerup', touchEnd);
    slide.addEventListener('pointerleave', touchEnd);
    slide.addEventListener('pointermove', touchMove);
  });
  
  function touchStart(index) {
    return function(event) {
      isDragging = true;
      startPos = event.clientX;
      animationID = requestAnimationFrame(animation);
      track.style.transition = 'none';
    }
  }
  
  function touchMove(event) {
    if (isDragging) {
      const currentPosition = event.clientX;
      currentTranslate = prevTranslate + currentPosition - startPos;
    }
  }
  
  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    const movedBy = currentTranslate - prevTranslate;
    track.style.transition = 'transform 0.5s ease';
    
    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;
    
    updateCarousel();
  }
  
  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  // Auto play carousel
  setInterval(() => {
    if (!isDragging) {
      if (currentIndex < slides.length - 1) currentIndex++;
      else currentIndex = 0;
      updateCarousel();
    }
  }, 5000);
});
