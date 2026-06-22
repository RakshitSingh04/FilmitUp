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

  // Preloader Animation
  const preloaderTl = gsap.timeline();
  document.body.style.overflow = 'hidden';
  lenis.stop(); // Stop scrolling
  
  preloaderTl.to('.preloader-bar', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
    .to('.camera-flash', { opacity: 1, duration: 0.05 })
    .to('.camera-flash', { opacity: 0, duration: 0.1 })
    .to('.preloader-content', { autoAlpha: 0, duration: 0.3 }, "-=0.1")
    .to('.preloader-top', { y: '-100%', duration: 0.8, ease: 'power4.inOut' })
    .to('.preloader-bottom', { y: '100%', duration: 0.8, ease: 'power4.inOut' }, "<")
    .set('.preloader', { display: 'none' })
    .call(() => {
      document.body.style.overflow = '';
      lenis.start();
      ScrollTrigger.refresh();
    });

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
  if (heroVisual && heroSection && !window.matchMedia('(pointer: coarse)').matches) {
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
  const mobileLinksItems = document.querySelectorAll('.mobile-nav-links li');

  hamburger.addEventListener('click', () => {
    const isOpening = !hamburger.classList.contains('active');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    
    if (isOpening) {
      gsap.fromTo(mobileLinksItems, 
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }
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
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(pointer: fine)').matches) {
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
  }

  // Swipe Hint Logic
  const swipeHint = document.querySelector('.swipe-hint');
  const carouselTrack = document.querySelector('.carousel-track');
  
  if (swipeHint && carouselTrack && window.matchMedia('(pointer: coarse)').matches) {
    ScrollTrigger.create({
      trigger: carouselTrack,
      start: "top 70%",
      onEnter: () => {
        gsap.to(swipeHint, { autoAlpha: 1, duration: 0.5 });
        gsap.to(swipeHint.querySelector('svg'), { 
          x: -20, 
          duration: 0.8, 
          yoyo: true, 
          repeat: 3, 
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(swipeHint, { autoAlpha: 0, duration: 0.5 });
          }
        });
      },
      once: true
    });
  }

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
    let activeIndex = 0;
    let autoSlideTween;
    let isProgrammaticScroll = false;
    let scrollTimeout;

    // Helper to play only the active video
    const playActiveVideo = (index) => {
      slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (video) {
          if (i === index) {
            video.play().catch(e => console.log('Video play prevented:', e));
          } else {
            video.pause();
          }
        }
      });
    };

    // Helper to update UI (dots, scroll position)
    const updateCarouselUI = (index, smooth = true) => {
      activeIndex = index;
      
      // Update dots
      const dots = dotContainer.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      // Scroll to active slide (clamped by browser automatically)
      const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
      isProgrammaticScroll = true;
      track.scrollTo({
        left: slideWidth * index,
        behavior: smooth ? 'smooth' : 'auto'
      });

      // Play video
      playActiveVideo(index);
    };
    
    // Generate dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        updateCarouselUI(i);
        resetProgress();
      });
      dotContainer.appendChild(dot);
    });
    
    // Listen to manual scroll to update activeIndex (clamped to max visible index)
    let isScrolling;
    track.addEventListener('scroll', () => {
      if (isProgrammaticScroll) {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isProgrammaticScroll = false;
        }, 150);
        return;
      }
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        const slideWidth = slides[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
        const scrollIndex = Math.round(track.scrollLeft / slideWidth);
        if (scrollIndex !== activeIndex && scrollIndex < slides.length) {
          activeIndex = scrollIndex;
          // Only update dot and video, don't trigger scrollTo to avoid scroll fighting
          const dots = dotContainer.querySelectorAll('.dot');
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === scrollIndex);
          });
          playActiveVideo(scrollIndex);
        }
      }, 66);
    });
    
    const resetProgress = () => {
      if (autoSlideTween) autoSlideTween.kill();
      gsap.set(progressFill, { width: '0%' });
      
      autoSlideTween = gsap.to(progressFill, {
        width: '100%',
        duration: 4, // 4 seconds per video
        ease: 'none',
        onComplete: () => {
          const nextIndex = (activeIndex + 1) % slides.length;
          updateCarouselUI(nextIndex);
          resetProgress();
        }
      });
    };
    
    // Intersection Observer for the carousel wrapper to pause video when offscreen
    const carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Pause active video when carousel is offscreen
          slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) video.pause();
          });
        } else {
          // Play active video when carousel comes back onscreen
          playActiveVideo(activeIndex);
        }
      });
    }, { threshold: 0.1 });
    carouselObserver.observe(document.querySelector('.carousel-wrapper'));

    // Start auto slide
    updateCarouselUI(0, false);
    resetProgress();
    
    prevBtn.addEventListener('click', () => {
      const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
      updateCarouselUI(prevIndex);
      resetProgress();
    });
    
    nextBtn.addEventListener('click', () => {
      const nextIndex = (activeIndex + 1) % slides.length;
      updateCarouselUI(nextIndex);
      resetProgress();
    });

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', () => {
        if (autoSlideTween) autoSlideTween.pause();
      });
      carouselWrapper.addEventListener('mouseleave', () => {
        if (autoSlideTween) autoSlideTween.play();
      });
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
  const cursorDot = document.querySelector('.cursor-dot:not(.ghost)');
  const ghost1 = document.querySelector('#ghost1');
  const ghost2 = document.querySelector('#ghost2');
  const ghost3 = document.querySelector('#ghost3');
  const cursorOutline = document.querySelector('.cursor-outline');
  const cursorText = document.querySelector('.cursor-text');
  
  if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
    gsap.set([cursorDot, ghost1, ghost2, ghost3, cursorOutline], {xPercent: -50, yPercent: -50});

    let xToDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
    let yToDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
    
    let xToGhost1 = gsap.quickTo(ghost1, "x", {duration: 0.2, ease: "power3"});
    let yToGhost1 = gsap.quickTo(ghost1, "y", {duration: 0.2, ease: "power3"});
    
    let xToGhost2 = gsap.quickTo(ghost2, "x", {duration: 0.3, ease: "power3"});
    let yToGhost2 = gsap.quickTo(ghost2, "y", {duration: 0.3, ease: "power3"});
    
    let xToGhost3 = gsap.quickTo(ghost3, "x", {duration: 0.4, ease: "power3"});
    let yToGhost3 = gsap.quickTo(ghost3, "y", {duration: 0.4, ease: "power3"});

    let xToOutline = gsap.quickTo(cursorOutline, "x", {duration: 0.15, ease: "power3"});
    let yToOutline = gsap.quickTo(cursorOutline, "y", {duration: 0.15, ease: "power3"});

    window.addEventListener('mousemove', (e) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToGhost1(e.clientX);
      yToGhost1(e.clientY);
      xToGhost2(e.clientX);
      yToGhost2(e.clientY);
      xToGhost3(e.clientX);
      yToGhost3(e.clientY);
      xToOutline(e.clientX);
      yToOutline(e.clientY);
    });

    // Hover logic for View
    document.querySelectorAll('.case-card img, .expertise-card, img').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('cursor-view');
        cursorText.textContent = "VIEW";
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('cursor-view');
        cursorText.textContent = "";
      });
    });

    // Hover logic for Click
    document.querySelectorAll('a, button, .magnetic').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('cursor-click');
        cursorText.textContent = "CLICK";
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('cursor-click');
        cursorText.textContent = "";
      });
    });

    // Hover logic for Drag
    document.querySelectorAll('.carousel-wrapper').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('cursor-drag');
        cursorText.textContent = "DRAG";
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('cursor-drag');
        cursorText.textContent = "";
      });
    });

    // Light adaptation for dark sections
    document.querySelectorAll('.dark-section, .hero, .expertise').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-light');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-light');
      });
    });
  }

  // 8. Magnetic Buttons
  const magneticElements = document.querySelectorAll('.magnetic');
  magneticElements.forEach(elem => {
    let xTo = gsap.quickTo(elem, "x", {duration: 0.4, ease: "power3"});
    let yTo = gsap.quickTo(elem, "y", {duration: 0.4, ease: "power3"});

    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const currentX = gsap.getProperty(elem, "x") || 0;
      const currentY = gsap.getProperty(elem, "y") || 0;
      
      const originalLeft = rect.left - currentX;
      const originalTop = rect.top - currentY;
      
      const x = e.clientX - originalLeft - rect.width / 2;
      const y = e.clientY - originalTop - rect.height / 2;
      
      xTo(x * 0.4);
      yTo(y * 0.4);
    });
    
    elem.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });


  // 11. Footer Stagger Reveal
  gsap.from('.footer-col', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  });
});
