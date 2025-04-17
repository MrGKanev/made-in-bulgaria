// This code adds an alphabetical letter navigation to the page
document.addEventListener('DOMContentLoaded', function() {
  // Create letter navigation
  function createLetterNavigation() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = alphabet.split('');
    
    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'letter-nav container mx-auto px-4 py-6 flex flex-wrap justify-center gap-3';
    
    // Create letter links
    letters.forEach(letter => {
      const letterLink = document.createElement('a');
      letterLink.href = `#section-${letter}`;
      letterLink.className = 'w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-bulgaria hover:text-white transition-colors';
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
    const filtersSection = document.querySelector('.py-6.bg-gray-50');
    filtersSection.after(navContainer);
    
    // Create letter section headers for projects
    organizeProjectsByLetter();
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
        <div class="text-5xl font-light text-gray-300 mb-6 mt-12 text-center">${letter}</div>
      `;
      
      projectsGrid.appendChild(letterSection);
      
      // Add projects under this letter
      projectsByLetter[letter].forEach(project => {
        projectsGrid.appendChild(project);
      });
    });
  }
  
  // Initialize after projects are loaded
  setTimeout(createLetterNavigation, 2000);
});