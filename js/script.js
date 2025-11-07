// script.js -- shared across pages
(function() {
  const KEY = 'studentProfile_v1';

  const defaults = {
    name: 'Sneha Marabannavar',
    email: 'snehamarabannavar@example.com',
    phone: '+91 98765 43210',
    location: 'Kundgol, Dharwad',
    about: "Hello! I'm Sneha, a Computer Science student passionate about web development and microcontrollers. I enjoy learning new skills and creating simple, functional projects.",
    photo: 'assets/profile.jpg'
  };

  function loadProfile() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign({}, defaults, JSON.parse(raw)) : defaults;
    } catch (e) {
      return defaults;
    }
  }

  function saveProfile(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function applyProfile(profile) {
    // names
    const siteNameEls = document.querySelectorAll('#siteName, #bioHeaderName, #resumeName, #pageName, #heroName');
    siteNameEls.forEach(el => { if (el) el.textContent = profile.name; });

    // split first/last if needed
    const parts = (profile.name || '').trim().split(' ');
    const first = parts[0] || profile.name;
    const last = parts.slice(1).join(' ') || '';
    const firstNameEl = document.getElementById('firstName');
    const lastNameEl = document.getElementById('lastName');
    if (firstNameEl) firstNameEl.textContent = first;
    if (lastNameEl) lastNameEl.textContent = last;

    // contact
    const phoneEls = document.querySelectorAll('#homePhone, #bioPhone, #resumePhone, #contactPhone');
    phoneEls.forEach(el => { if (el) el.textContent = profile.phone; });
    const emailEls = document.querySelectorAll('#homeEmail, #bioEmail, #resumeEmail, #contactEmail');
    emailEls.forEach(el => { if (el) el.textContent = profile.email; });
    const locEls = document.querySelectorAll('#homeLocation, #resumeLocation');
    locEls.forEach(el => { if (el) el.textContent = profile.location; });

    // about/profile
    const aboutEls = document.querySelectorAll('#aboutMe, #bioAbout, #profileSummary');
    aboutEls.forEach(el => { if (el) el.textContent = profile.about; });

    // images: update src on relevant images
    const imgIds = ['headerPhoto','bioHeaderPhoto','resumeHeaderPhoto','bioPhoto','resumePhoto'];
    imgIds.forEach(id => {
      const img = document.getElementById(id);
      if (img) img.src = profile.photo || defaults.photo;
    });
    // also update any generic site-photo imgs
    const genericImgs = document.querySelectorAll('.site-photo');
    genericImgs.forEach(img => { if (img) img.src = profile.photo || defaults.photo; });

    // footer/year
    const yearEls = document.querySelectorAll('#footerYear, #bioYear');
    yearEls.forEach(el => { if (el) el.textContent = new Date().getFullYear(); });

    // small name spots
    const footerNameEls = document.querySelectorAll('#footerName, #bioFooterName');
    footerNameEls.forEach(el => { if (el) el.textContent = profile.name; });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const profile = loadProfile();
    applyProfile(profile);

    // handle contact form saving
    const form = document.getElementById('editForm');
    if (form) {
      // prefill
      form.name.value = profile.name || '';
      form.email.value = profile.email || '';
      form.phone.value = profile.phone || '';
      if (form.location) form.location.value = profile.location || '';
      if (form.about) form.about.value = profile.about || '';
      if (form.photo) form.photo.value = profile.photo || '';

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const updated = {
          name: (fd.get('name') || '').trim() || defaults.name,
          email: (fd.get('email') || '').trim() || defaults.email,
          phone: (fd.get('phone') || '').trim() || defaults.phone,
          location: (fd.get('location') || '').trim() || defaults.location,
          about: (fd.get('about') || '').trim() || defaults.about,
          photo: (fd.get('photo') || '').trim() || defaults.photo
        };
        saveProfile(updated);
        applyProfile(updated);
        alert('Saved locally. Changes applied across pages.');
        // redirect back to resume to show effect
        window.location.href = 'resume.html';
      });
    }
  });
})();
