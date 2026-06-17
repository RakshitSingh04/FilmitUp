import './style.css'

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lenis for Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  gsap.registerPlugin(ScrollTrigger);

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);

  // Hero Text Reveal
  const revealTexts = document.querySelectorAll('.reveal-text');
  if (revealTexts.length > 0) {
    gsap.to(revealTexts, {
      y: '0%',
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
      delay: 0.2
    });
    
    // Animate accent line
    gsap.to('.title-line', {
      width: '100%',
      duration: 1,
      ease: 'power4.out',
      delay: 0.8
    });
  }

  // Floating Camera Animation
  const heroImg = document.querySelector('.hero-img');
  const heroShadow = document.querySelector('.hero-img-shadow');
  if (heroImg && heroShadow) {
    // Float image
    gsap.to(heroImg, { 
      y: -20, 
      rotationX: 2, 
      duration: 2.5, 
      ease: 'sine.inOut', 
      yoyo: true, 
      repeat: -1 
    });
    // Scale shadow
    gsap.to(heroShadow, { 
      scale: 0.8, 
      opacity: 0.5, 
      duration: 2.5, 
      ease: 'sine.inOut', 
      yoyo: true, 
      repeat: -1 
    });
  }

  // Mouse Parallax Tilt
  const heroVisual = document.querySelector('.hero-img-wrapper');
  const heroSection = document.querySelector('.hero');
  if (heroVisual && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(heroVisual, {
        rotationY: x * 10,
        rotationX: -y * 10,
        ease: 'power1.out',
        transformPerspective: 1000,
        transformOrigin: 'center'
      });
    });
    heroSection.addEventListener('mouseleave', () => {
      gsap.to(heroVisual, { rotationY: 0, rotationX: 0, ease: 'power2.out' });
    });
  }

  // Navbar Dynamic Colors over Light Sections
  const lightSections = document.querySelectorAll('.light-section');
  const navbar = document.getElementById('navbar');
  lightSections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 80px",
      end: "bottom 80px",
      onEnter: () => navbar.classList.add('nav-dark-text'),
      onLeave: () => navbar.classList.remove('nav-dark-text'),
      onEnterBack: () => navbar.classList.add('nav-dark-text'),
      onLeaveBack: () => navbar.classList.remove('nav-dark-text')
    });
  });

  // 2. Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // 3. ScrollSpy Navigation
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navIndicator = document.querySelector('.nav-indicator');

  function updateNavIndicator() {
    const activeLink = document.querySelector('.desktop-nav a.active');
    if (activeLink && navIndicator && !activeLink.classList.contains('nav-cta')) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = document.querySelector('.desktop-nav').getBoundingClientRect();
      gsap.to(navIndicator, {
        x: (linkRect.left - navRect.left) + (linkRect.width / 2) - 2,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else if (navIndicator) {
      gsap.to(navIndicator, { opacity: 0, duration: 0.3 });
    }
  }
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    let activeChanged = false;
    navLinks.forEach(link => {
      const wasActive = link.classList.contains('active');
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
        if (!wasActive) activeChanged = true;
      }
    });
    
    if (activeChanged) updateNavIndicator();
  });

  setTimeout(updateNavIndicator, 100);

  // 4. Back to Top Button
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

  // 5. Stats Section Entrance & Counter Animation
  ScrollTrigger.create({
    trigger: '.stats-grid',
    start: "top 80%",
    onEnter: () => {
      // Scale up the items
      gsap.fromTo('.stat-item', 
        { scale: 0.5, autoAlpha: 0 }, 
        { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.5)" }
      );
      
      // Animate the SVG rings
      gsap.utils.toArray('.stat-ring').forEach(ring => {
        ring.classList.add('in-view');
      });

      // Animate the counters with GSAP elastic ease
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: "elastic.out(1, 0.5)",
          onUpdate: () => {
            counter.innerText = Math.round(obj.val);
          }
        });
      });
    },
    once: true
  });

  // 6. GSAP Reveal Animations
  gsap.utils.toArray('.gs-reveal-up').forEach(function(elem) {
    ScrollTrigger.create({
      trigger: elem,
      start: "top 85%",
      onEnter: function() {
        gsap.fromTo(elem, { y: 60, autoAlpha: 0, filter: 'blur(5px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: "power3.out", overwrite: "auto" });
      },
      once: true
    });
  });

  gsap.utils.toArray('.gs-reveal-right').forEach(function(elem) {
    ScrollTrigger.create({
      trigger: elem,
      start: "top 85%",
      onEnter: function() {
        gsap.fromTo(elem, { x: 60, autoAlpha: 0, filter: 'blur(5px)' }, { x: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: "power3.out", overwrite: "auto" });
      },
      once: true
    });
  });

  // Split section titles for character stagger
  const sectionTitles = document.querySelectorAll('.section-title strong');
  sectionTitles.forEach(title => {
    const text = title.innerText;
    title.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.classList.add('char-reveal');
      title.appendChild(span);
    });
    
    ScrollTrigger.create({
      trigger: title,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(title.querySelectorAll('.char-reveal'), 
          { y: 20, autoAlpha: 0, rotationX: -90 }, 
          { y: 0, autoAlpha: 1, rotationX: 0, duration: 0.8, stagger: 0.05, ease: "back.out(1.5)" }
        );
      },
      once: true
    });
  });

  // Parallax Depth for Section Titles
  const parallaxTitles = document.querySelectorAll('.section-title');
  parallaxTitles.forEach(title => {
    gsap.to(title, {
      y: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: title.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Staggered reveals for grids
  ScrollTrigger.create({
    trigger: '.expertise-grid',
    start: "top 80%",
    onEnter: () => {
      gsap.fromTo('.expertise-col', 
        { y: 50, rotateX: 10, autoAlpha: 0 }, 
        { y: 0, rotateX: 0, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    },
    once: true
  });

  ScrollTrigger.create({
    trigger: '.marquee-container',
    start: "top 80%",
    onEnter: () => {
      gsap.fromTo('.marquee-row', { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.5)" });
    },
    once: true
  });

  // Case Studies alternating reveal
  gsap.utils.toArray('.gs-reveal-side').forEach(function(elem) {
    const side = elem.getAttribute('data-side');
    const xOffset = side === 'left' ? -100 : 100;
    ScrollTrigger.create({
      trigger: elem,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(elem, 
          { x: xOffset, autoAlpha: 0 }, 
          { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }
        );
      },
      once: true
    });
  });

  // Carousel Entrance Animation
  ScrollTrigger.create({
    trigger: '.carousel-wrapper',
    start: "top 80%",
    onEnter: () => {
      gsap.fromTo('.carousel-slide', { x: 80, autoAlpha: 0, scale: 0.9 }, { x: 0, autoAlpha: 1, scale: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out' });
    },
    once: true
  });

  // 7. Carousel Logic
  const track = document.getElementById('client-carousel');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dotContainer = document.getElementById('carousel-dots');
  const progressFill = document.querySelector('.progress-fill');
  
  if (track && prevBtn && nextBtn && dotContainer) {
    const slides = document.querySelectorAll('.carousel-slide');
    
    // Generate dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
        track.scrollTo({ left: slideWidth * i, behavior: 'smooth' });
        resetProgress();
      });
      dotContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Update active dot on scroll
    track.addEventListener('scroll', () => {
      const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
      const index = Math.round(track.scrollLeft / slideWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    });

    let autoSlideTween;
    
    const resetProgress = () => {
      if (autoSlideTween) autoSlideTween.kill();
      gsap.set(progressFill, { width: '0%' });
      
      autoSlideTween = gsap.to(progressFill, {
        width: '100%',
        duration: 3,
        ease: 'none',
        onComplete: () => {
          if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
            track.scrollBy({ left: slideWidth, behavior: 'smooth' });
          }
          resetProgress();
        }
      });
    };
    
    // Start auto slide
    resetProgress();
    
    prevBtn.addEventListener('click', () => {
      const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
      track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      resetProgress();
    });
    
    nextBtn.addEventListener('click', () => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
        track.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
      resetProgress();
    });

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', () => autoSlideTween.pause());
      carouselWrapper.addEventListener('mouseleave', () => autoSlideTween.play());
    }
  }

  // 8. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = question.classList.contains('active');
      
      // Close all other open answers
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        q.parentElement.classList.remove('active');
        q.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        question.classList.add('active');
        question.parentElement.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // 9. Custom Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });

    const hoverElements = document.querySelectorAll('a, button, .magnetic, .brand-card, .case-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  }

  // 8. Magnetic Buttons
  const magneticElements = document.querySelectorAll('.magnetic');
  magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      elem.style.transition = `transform 0.1s ease`;
    });
    elem.addEventListener('mouseleave', () => {
      elem.style.transform = 'translate(0px, 0px)';
      elem.style.transition = `transform 0.3s ease`;
    });
  });
});
