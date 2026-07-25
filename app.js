/**
 * Charlen Baloukjy - Personal Portfolio Website Javascript
 * Handle navbar scroll effects, mobile menu toggle, skill category filtering,
 * theme/glow adjustments, and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     NAVBAR SCROLL EFFECT
     ========================================================================== */
  const navbar = document.getElementById('main-navbar');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Run once at load

  /* ==========================================================================
     MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navMenuContainer = document.getElementById('nav-menu-container');
  const navItems = document.querySelectorAll('.nav-item');
  const menuIcon = menuToggleBtn.querySelector('i');

  const toggleMenu = () => {
    navMenuContainer.classList.toggle('active');
    if (navMenuContainer.classList.contains('active')) {
      menuIcon.classList.replace('fa-bars', 'fa-xmark');
    } else {
      menuIcon.classList.replace('fa-xmark', 'fa-bars');
    }
  };

  menuToggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking nav items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navMenuContainer.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  /* ==========================================================================
     ACTIVE NAVIGATION LINK ACCORDING TO CURRENT SECTION
     ========================================================================== */
  const sections = document.querySelectorAll('section');

  const handleActiveSectionHighlight = () => {
    let scrollPos = window.scrollY + 200; // Offset for navbar

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleActiveSectionHighlight);
  handleActiveSectionHighlight(); // Initial load check

  /* ==========================================================================
     KNOWLEDGE & SKILLS FILTERING
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active tab styling
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterCategory = button.getAttribute('data-category');

      // Filter skill cards
      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Reset element states
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';

        if (filterCategory !== 'all' && cardCategory !== filterCategory) {
          // Fade and hide
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          
          // Delay display change to match transitions
          setTimeout(() => {
            if (button.classList.contains('active')) {
              card.classList.add('hidden');
            }
          }, 200);
        }
      });
    });
  });

  /* ==========================================================================
     DYNAMIC AMBIENT GLOW & ORB MODIFIERS
     ========================================================================== */
  const themeBtn = document.getElementById('theme-btn');
  const orbs = document.querySelectorAll('.glow-orb');

  // Load theme preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
    themeBtn.style.color = '#fbbf24';
  }

  const toggleThemeMode = () => {
    document.body.classList.add('theme-transition');
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    
    // Scale orbs for feedback
    orbs.forEach(orb => {
      orb.style.transform = 'scale(1.3)';
      setTimeout(() => {
        orb.style.transform = '';
      }, 500);
    });

    const icon = themeBtn.querySelector('i');
    if (isLight) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      themeBtn.style.color = '#fbbf24';
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      themeBtn.style.color = '';
    }

    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 400);
  };

  themeBtn.addEventListener('click', toggleThemeMode);

  // Mouse interaction: Move orbs slightly according to mouse position
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
      const depth = (index + 1) * 20;
      const xTranslation = (mouseX - 0.5) * depth;
      const yTranslation = (mouseY - 0.5) * depth;
      orb.style.margin = `${yTranslation}px 0 0 ${xTranslation}px`;
    });
  });

  /* ==========================================================================
     CONTACT FORM HANDLING & CLIENT-SIDE VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formInputs = contactForm.querySelectorAll('.form-input');
  const formStatus = document.getElementById('form-status-message');

  // Interactive field validations
  const validateField = (input) => {
    const parent = input.parentElement;
    let isValid = true;

    // Check custom checks
    if (input.required && !input.value.trim()) {
      isValid = false;
    } else if (input.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailPattern.test(input.value.trim());
    }

    if (!isValid) {
      parent.classList.add('invalid');
    } else {
      parent.classList.remove('invalid');
    }

    return isValid;
  };

  // Add validation on input/blur
  formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  // Submit Handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    
    // Validate all inputs before submitting
    formInputs.forEach(input => {
      const fieldValid = validateField(input);
      if (!fieldValid) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      formStatus.textContent = 'Please correct the errors in the fields above.';
      formStatus.className = 'form-status error';
      return;
    }

    // Simulate sending email
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const submitBtnText = submitBtn.querySelector('span');
    const submitBtnIcon = submitBtn.querySelector('i');
    
    // Save original state
    const originalText = submitBtnText.textContent;
    const originalIconClass = submitBtnIcon.className;

    // Set loading state
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending Message...';
    submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
    formStatus.textContent = '';

    const nameVal = document.getElementById('contact-name').value.trim();
    const emailVal = document.getElementById('contact-email').value.trim();
    const messageVal = document.getElementById('contact-message').value.trim();

    fetch("https://formsubmit.co/ajax/charlenbaloukjy@outlook.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: nameVal,
        email: emailVal,
        message: messageVal,
        _subject: `New Portfolio Message from ${nameVal}`
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to send message.');
      }
    })
    .then(data => {
      // Reset button
      submitBtn.disabled = false;
      submitBtnText.textContent = originalText;
      submitBtnIcon.className = originalIconClass;

      // Show success thanking the visitor
      formStatus.textContent = `Thank you ${nameVal}! Your message has been sent successfully.`;
      formStatus.className = 'form-status success';

      // Clear input fields
      contactForm.reset();
      
      // Clear status message after delay
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    })
    .catch(error => {
      // Reset button
      submitBtn.disabled = false;
      submitBtnText.textContent = originalText;
      submitBtnIcon.className = originalIconClass;

      // Show error
      formStatus.textContent = 'Oops! There was an issue sending your message. Please try again or email directly.';
      formStatus.className = 'form-status error';
    });

  });

});
