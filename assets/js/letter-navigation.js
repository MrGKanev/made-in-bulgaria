// This code adds an optional alphabetical letter navigation to the page
document.addEventListener('DOMContentLoaded', function() {
  // Create letter navigation
  function createLetterNavigation() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = alphabet.split('');
    
    // Create toggle button and add it directly to the filters section with other filters
    const filtersContainer = document.querySelector('.py-6.bg-gray-50 .container .flex.flex-wrap');
    
    const toggleButton = document.createElement('button');
    toggleButton.className = 'filter-btn bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm';
    toggleButton.innerHTML = `
      <span class="flex items-center">
        <img src="assets/img/icons/font.svg" alt="A-Z" class="icon-sm mr-1">
        A-Z Navigation
      </span>
    `;
    toggleButton.id = 'toggle-letter-nav';
    
    filtersContainer.appendChild(toggleButton);
    
    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'letter-nav container mx-auto px-4 py-6 flex flex-wrap justify-center gap-4 hidden';
    navContainer.id = 'letter-navigation';
    
    // Create letter links
    letters.forEach(letter => {
      const letterLink = document.createElement('a');
      letterLink.href = `#section-${letter}`;
      letterLink.className = 'filter-btn bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm';
      letterLink.textContent = letter;
      letterLink.addEventListener('click', (e) => {
        // Check if section exists before scrolling
        const sectionExists = document.getElementById(`section-${letter}`);
        if (!sectionExists) {
          e.preventDefault();
          // Optional: show message that no projects exist for this letter
        }
      });
      navContainer.appendChild(letterLink);
    });
    
    // Insert after the filters section
    const filtersSection2 = document.querySelector('.py-6.bg-gray-50');
    filtersSection2.after(navContainer);
    
    // Set up toggle button functionality
    toggleButton.addEventListener('click', function() {
      const letterNav = document.getElementById('letter-navigation');
      if (letterNav.classList.contains('hidden')) {
        letterNav.classList.remove('hidden');
        toggleButton.classList.remove('bg-white', 'text-gray-700');
        toggleButton.classList.add('bg-bulgaria', 'text-white');
        // Reorganize projects when showing the letter navigation
        organizeProjectsByLetter();
      } else {
        letterNav.classList.add('hidden');
        toggleButton.classList.remove('bg-bulgaria', 'text-white');
        toggleButton.classList.add('bg-white', 'text-gray-700');
        // Reset projects to default view
        resetProjectsView();
      }
    });
  }
  
  // Reset projects to their default view
  function resetProjectsView() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = Array.from(projectsGrid.querySelectorAll('.project-card'));
    const letterSections = Array.from(projectsGrid.querySelectorAll('[id^="section-"]'));
    
    // Remove letter sections
    letterSections.forEach(section => section.remove());
    
    // Restore all projects
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
      projectsGrid.appendChild(project);
    });
    
    // Re-apply any active filters
    const activeFilter = document.querySelector('.filter-btn.active:not(#toggle-letter-nav)');
    if (activeFilter) {
      const filterEvent = new Event('click');
      activeFilter.dispatchEvent(filterEvent);
    }
  }
  
  // Organize projects by first letter
  function organizeProjectsByLetter() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = Array.from(projectsGrid.querySelectorAll('.project-card'));
    
    // Group projects by first letter
    const projectsByLetter = {};
    
    projects.forEach(project => {
      const projectName = project.querySelector('h3').textContent.trim();
      const firstLetter = projectName.charAt(0).toUpperCase();
      
      if (!projectsByLetter[firstLetter]) {
        projectsByLetter[firstLetter] = [];
      }
      
      projectsByLetter[firstLetter].push(project);
    });
    
    // Clear the grid
    projectsGrid.innerHTML = '';
    
    // Sort letters alphabetically
    const sortedLetters = Object.keys(projectsByLetter).sort();
    
    // Create letter sections and add projects
    sortedLetters.forEach(letter => {
      // Create letter section header
      const letterSection = document.createElement('div');
      letterSection.id = `section-${letter}`;
      letterSection.className = 'col-span-full';
      letterSection.innerHTML = `
        <div class="text-5xl font-light text-gray-300 mb-6 mt-8 text-center">${letter}</div>
      `;
      
      projectsGrid.appendChild(letterSection);
      
      // Add projects under this letter
      projectsByLetter[letter].forEach(project => {
        projectsGrid.appendChild(project);
      });
    });
  }
  
  // Initialize immediately when DOM loads
  createLetterNavigation();
});