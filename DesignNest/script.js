document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const datetime = form.datetime.value;
    const projectType =form.projectType.value;
    const message = form.message.value;

    // Validate form fields
    if (!name || !phone || !email || !datetime || !projectType) {
        alert("All fields are required.");
        return;
    }

    // Send form data to WhatsApp
    const whatsappMessage = `
        New Consultation Request:
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        Preferred Date & Time: ${datetime}
        Project Type:${projectType}
        Message: ${message}
    `;
    const whatsappNumber = "919064734071"; // full international format
    const whatsappAPIUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappAPIUrl, "_blank");

    // Save form data to Google Sheets via Apps Script Web App
    const scriptURL = "https://script.google.com/macros/s/AKfycbxXizeSY2ayp83qe7kYDEXbeil4Bylf3ddY4nnhWgwnGVwTg5UrUwQnE1ncaHEm25Pu/exec"; // replace with deployed Apps Script URL
    const data = { name, phone, email, datetime,projectType,message };

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        console.log("Data saved to Google Sheets:", result);
        // document.getElementById("formFeedback").style.display = "block"; // Assuming you might add this element later
    })
    .catch(error => {
        console.error("🚫Your data not sent please try again", error);
    });
});
           
    // --- Mobile Menu Toggle & Auto-Close Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('#mobile-menu a.mobile-link');
    const productsToggleMobile = document.getElementById('products-toggle-mobile');
    const productsMenuMobile = document.getElementById('products-menu-mobile');

    function closeMobileMenu() {
        menuToggle.classList.remove('open');
        mobileMenu.classList.add('hidden');
        // NOTE: Also ensure the menu collapses correctly when hidden
        mobileMenu.classList.remove('block'); 
        // Optional: Collapse product sub-menus when closing the main menu
        productsMenuMobile.classList.add('hidden');
        productsToggleMobile.querySelector('.arrow-icon').innerHTML = '▼';
        document.querySelectorAll('.sub-toggle-btn').forEach(btn => {
            const targetId = btn.dataset.target;
            document.getElementById(targetId).classList.add('hidden');
            btn.querySelector('.sub-arrow').innerHTML = '▶';
        });
    }

    // 1. Main Menu Toggle (opens/closes the menu when clicking the hamburger icon)
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('open');
        // FIX: Toggle 'hidden' AND toggle the required display class (e.g., 'block')
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('block'); 
    });

    // 2. Auto-close mechanism (closes the entire menu when clicking any *anchor* link)
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // 3. Mobile Products main accordion/toggle logic
    productsToggleMobile.addEventListener('click', function() {
        productsMenuMobile.classList.toggle('hidden');
        const arrow = this.querySelector('.arrow-icon');
        arrow.innerHTML = productsMenuMobile.classList.contains('hidden') ? '▼' : '▲';
    });

    // 4. Mobile Sub-Product toggles (Modular Kitchen, Wardrobes, Full Renovation)
    mobileMenu.querySelectorAll('.sub-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);
            const arrow = this.querySelector('.sub-arrow');

            targetElement.classList.toggle('hidden');
            arrow.innerHTML = targetElement.classList.contains('hidden') ? '▶' : '▼';
        });
    });

    // --- Project Filter Logic ---
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

            // Add active class to the clicked button
            this.classList.add('active');
            const filter = this.dataset.filter;
            const galleryItems = document.querySelectorAll('#project-gallery .project-item');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    // Before/After slider
document.querySelectorAll('.before-after').forEach(container => {
  const afterImg = container.querySelector('.after-img');
  const handle = container.querySelector('.slider-handle');

  const move = x => {
    const rect = container.getBoundingClientRect();
    let pos = Math.max(rect.left, Math.min(x, rect.right));
    let percent = ((pos - rect.left) / rect.width) * 100;
    afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
  };

  let dragging = false;

  // Mouse
  handle.addEventListener('mousedown', e => dragging = true);
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('mousemove', e => dragging && move(e.clientX));

  // Touch
  handle.addEventListener('touchstart', e => dragging = true);
  window.addEventListener('touchend', () => dragging = false);
  window.addEventListener('touchmove', e => {
    if (dragging) move(e.touches[0].clientX);
  });
});

//Process Animate section
  const steps = document.querySelectorAll('.process-step');
  const timeline = document.getElementById('timeline-fill');

  let currentStep = 0;
  let interval;

  function activateStep() {
    steps.forEach(step => step.classList.remove('active'));
    steps[currentStep].classList.add('active');

    // Animate timeline
    const progress = ((currentStep + 1) / steps.length) * 100;
    timeline.style.width = progress + '%';

    currentStep = (currentStep + 1) % steps.length;
  }

  function startAnimation() {
    activateStep();
    interval = setInterval(activateStep, 1500);
  }

  function stopAnimation() {
    clearInterval(interval);
  }

  // Pause on hover
  steps.forEach(step => {
    step.addEventListener('mouseenter', stopAnimation);
    step.addEventListener('mouseleave', startAnimation);
  });

  startAnimation();