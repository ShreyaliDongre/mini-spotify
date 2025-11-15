
(function() {
  'use strict';
  
  // Get saved theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('ms-theme') || 'dark';
  
  // Apply saved theme on page load
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  // Initialize theme toggle button if it exists
  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Update toggle visual state
    updateToggleState();
    
    // Add click event listener
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      
      // Save to localStorage
      localStorage.setItem('ms-theme', newTheme);
      
      // Update toggle visual state
      updateToggleState();
      
      console.log('Theme switched to:', newTheme);
    });
  }
  
  // Update toggle button visual state
  function updateToggleState() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const icon = themeToggle.querySelector('.theme-toggle-icon');
    
    if (icon) {
      icon.textContent = isLight ? '☀️' : '🌙';
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

// Navigation scroll effect
(function() {
  'use strict';
  
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavScroll);
  } else {
    initNavScroll();
  }
})();

