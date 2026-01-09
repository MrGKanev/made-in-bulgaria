// Letter navigation module - organizes projects alphabetically
(function() {
  'use strict';

  // Cache DOM references
  let projectsGrid = null;
  let letterNav = null;
  let toggleButton = null;
  let isActive = false;

  // Store original projects for reset
  let originalProjects = [];

  function init() {
    projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    createToggleButton();
    createLetterNavigation();
  }

  function createToggleButton() {
    const filtersContainer = document.querySelector('.py-6.bg-gray-50 .container .flex.flex-wrap');
    if (!filtersContainer) return;

    toggleButton = document.createElement('button');
    toggleButton.className = 'filter-btn bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm';
    toggleButton.id = 'toggle-letter-nav';

    const span = document.createElement('span');
    span.className = 'flex items-center';

    const img = document.createElement('img');
    img.src = 'assets/img/icons/font.svg';
    img.alt = '';
    img.className = 'icon-sm mr-1';

    span.appendChild(img);
    span.appendChild(document.createTextNode('A-Z Navigation'));
    toggleButton.appendChild(span);

    toggleButton.addEventListener('click', toggleNavigation);
    filtersContainer.appendChild(toggleButton);
  }

  function createLetterNavigation() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const filtersSection = document.querySelector('.py-6.bg-gray-50');
    if (!filtersSection) return;

    letterNav = document.createElement('div');
    letterNav.className = 'letter-nav container mx-auto px-4 py-6 flex flex-wrap justify-center gap-4 hidden';
    letterNav.id = 'letter-navigation';

    // Use DocumentFragment for efficient DOM insertion
    const fragment = document.createDocumentFragment();

    for (const letter of alphabet) {
      const link = document.createElement('a');
      link.href = `#section-${letter}`;
      link.className = 'filter-btn bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm';
      link.textContent = letter;
      link.addEventListener('click', handleLetterClick);
      fragment.appendChild(link);
    }

    letterNav.appendChild(fragment);
    filtersSection.after(letterNav);
  }

  function handleLetterClick(e) {
    const letter = e.target.textContent;
    const section = document.getElementById(`section-${letter}`);
    if (!section) {
      e.preventDefault();
    }
  }

  function toggleNavigation() {
    if (!letterNav || !toggleButton) return;

    isActive = !isActive;

    if (isActive) {
      // Store current projects before reorganizing
      originalProjects = Array.from(projectsGrid.querySelectorAll('.project-card'));

      letterNav.classList.remove('hidden');
      toggleButton.classList.remove('bg-white', 'text-gray-700');
      toggleButton.classList.add('bg-bulgaria', 'text-white');
      organizeByLetter();
    } else {
      letterNav.classList.add('hidden');
      toggleButton.classList.remove('bg-bulgaria', 'text-white');
      toggleButton.classList.add('bg-white', 'text-gray-700');
      resetView();
    }
  }

  function organizeByLetter() {
    const projects = Array.from(projectsGrid.querySelectorAll('.project-card'));
    if (projects.length === 0) return;

    // Group projects by first letter
    const grouped = {};
    projects.forEach(project => {
      const nameEl = project.querySelector('h3');
      const name = nameEl ? nameEl.textContent.trim() : '';
      const letter = name.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(project);
    });

    // Build new content with DocumentFragment
    const fragment = document.createDocumentFragment();
    const sortedLetters = Object.keys(grouped).sort();

    sortedLetters.forEach(letter => {
      // Create section header using safe DOM methods
      const section = document.createElement('div');
      section.id = `section-${letter}`;
      section.className = 'col-span-full';

      const letterHeader = document.createElement('div');
      letterHeader.className = 'text-5xl font-light text-gray-300 mb-6 mt-8 text-center';
      letterHeader.textContent = letter;
      section.appendChild(letterHeader);

      fragment.appendChild(section);

      // Add projects for this letter
      grouped[letter].forEach(project => {
        fragment.appendChild(project);
      });
    });

    // Clear and rebuild grid
    while (projectsGrid.firstChild) {
      projectsGrid.removeChild(projectsGrid.firstChild);
    }
    projectsGrid.appendChild(fragment);
  }

  function resetView() {
    // Clear grid
    while (projectsGrid.firstChild) {
      projectsGrid.removeChild(projectsGrid.firstChild);
    }

    // Restore original projects
    originalProjects.forEach(project => {
      projectsGrid.appendChild(project);
    });
    originalProjects = [];

    // Re-trigger current filter
    const activeFilter = document.querySelector('.filter-btn.active:not(#toggle-letter-nav)');
    if (activeFilter) {
      activeFilter.click();
    }
  }

  // Expose for external use
  window.organizeProjectsByLetter = organizeByLetter;

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
})();
