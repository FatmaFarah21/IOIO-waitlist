// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  /*** HERO CAROUSEL ***/
  let currentSlide = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % totalSlides);
  }

  let carouselInterval = setInterval(nextSlide, 6000);

  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      showSlide(idx);
      clearInterval(carouselInterval);
      carouselInterval = setInterval(nextSlide, 6000);
    });
  });

  // Initialize first slide
  showSlide(0);

  /*** FAQ ACCORDION ***/
// FAQ Accordion Logic
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.answer;
    const answerPanel = document.getElementById(target);
    const isActive = btn.classList.contains('active');

    // Close all answers
    document.querySelectorAll('.faq-answer-content').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('active'));

    // Toggle current answer
    if (!isActive) {
      answerPanel.classList.add('show');
      btn.classList.add('active');
    }
  });
});


  /*** FLOATING ELEMENTS FOR FEATURED SECTIONS ***/
  function createFloatingElement(parent, type = 'circle', size = 80, top = '10%', left = '10%', opacity = 0.2) {
    const el = document.createElement('div');
    el.classList.add(type === 'circle' ? 'float-circle' : 'float-square');
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.top = top;
    el.style.left = left;
    el.style.opacity = opacity;
    parent.appendChild(el);
  }

  // Featured Properties
  const featuredProps = document.querySelector('#featured-properties');
  if (featuredProps) {
    const container = document.createElement('div');
    container.classList.add('floating-elements-featured');
    featuredProps.appendChild(container);

    createFloatingElement(container, 'circle', 100, '10%', '5%');
    createFloatingElement(container, 'square', 80, '60%', '80%');
  }

  // Featured Services
  const featuredServices = document.querySelector('#featured-services');
  if (featuredServices) {
    const container = document.createElement('div');
    container.classList.add('floating-elements-featured');
    featuredServices.appendChild(container);

    createFloatingElement(container, 'circle', 90, '15%', '15%');
    createFloatingElement(container, 'square', 120, '40%', '70%');
  }

  /*** MODAL HANDLERS ***/
  const serviceModal = document.getElementById('serviceModal');
  window.showServiceModal = () => {
    serviceModal.classList.add('show');
    serviceModal.setAttribute('aria-hidden', 'false');
  };
  window.closeServiceModal = () => {
    serviceModal.classList.remove('show');
    serviceModal.setAttribute('aria-hidden', 'true');
  };

  /*** SERVICE FORM SUBMISSION ***/
  const serviceForm = document.getElementById('serviceForm');
  if (serviceForm) {
    serviceForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(serviceForm);
      const payload = Object.fromEntries(formData.entries());
      // Use relative URL that will work with the deployed backend
      const API_BASE = window.API_BASE_URL || '/api';

      try {
        const res = await fetch(`${API_BASE}/service`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) alert('Service submitted successfully!');
        else alert('Submission failed (server). Saved locally.');
      } catch (err) {
        console.warn('Backend not available:', err);
        alert('Service submitted locally. Backend unavailable.');
      } finally {
        serviceForm.reset();
        closeServiceModal();
      }
    });
  }

  /*** HERO CTA BOXES ***/
  const ctaBoxes = document.querySelectorAll('.hero-cta-box');
  if (ctaBoxes.length >= 2) {
    // First box scrolls to properties
    ctaBoxes[0].addEventListener('click', () => {
      const propertiesSection = document.getElementById('featured-properties');
      if (propertiesSection) propertiesSection.scrollIntoView({ behavior: 'smooth' });
    });
    // Second box opens service modal
    ctaBoxes[1].addEventListener('click', showServiceModal);
  }
});
