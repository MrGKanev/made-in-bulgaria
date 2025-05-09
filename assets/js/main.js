// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
// Submit modal elements are no longer needed since we're linking to GitHub
const submitModal = document.getElementById('submit-modal');
const closeModal = document.getElementById('close-modal');
const projectForm = document.getElementById('project-form');

// Store projects data globally
let projectsData = [];

// Function to fetch projects from JSON file
async function fetchProjects() {
    try {
        const response = await fetch('assets/js/projects.json');
        if (!response.ok) {
            throw new Error('Failed to fetch projects data');
        }
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Function to render projects
function renderProjects(projects) {
    // Clear loading spinner
    projectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <h3 class="text-xl font-medium text-gray-500">No projects found matching your criteria</h3>
                <p class="mt-2 text-gray-400">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300';
        card.setAttribute('data-category', project.category);
        
        // Status label display
        let statusLabel = '';
        let statusClass = '';
        
        if (project.status === 'active') {
            statusLabel = '🚀 Active';
            statusClass = 'bg-green-100 text-green-800';
        } else if (project.status === 'inactive') {
            statusLabel = '🏁 Inactive';
            statusClass = 'bg-yellow-100 text-yellow-800';
        } else if (project.status === 'deprecated') {
            statusLabel = '⚠️ Deprecated';
            statusClass = 'bg-red-100 text-red-800';
        }
        
        card.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold">${project.name}</h3>
                    <div class="flex items-center">
                        <img src="assets/img/icons/star.svg" alt="" class="icon-sm text-yellow-400 mr-1">
                        <span>${project.stars}</span>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">${project.description}</p>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <span class="mr-4">by ${project.owner}</span>
                    <div class="flex space-x-2">
                        <span class="category-tag">${project.category.replace('-', ' ')}</span>
                        ${project.status ? `<span class="px-2 py-1 rounded-full ${statusClass}">${statusLabel}</span>` : ''}
                    </div>
                </div>
                <div class="flex justify-between">
                    <a href="${project.url}" target="_blank" class="text-bulgaria hover:underline font-medium" aria-label="Visit ${project.name}">
                        <span class="flex items-center">
                            <img src="assets/img/icons/external-link.svg" alt="" class="icon-sm mr-1">
                            Visit
                        </span>
                    </a>
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" class="text-gray-700 hover:text-gray-900" aria-label="${project.name}'s GitHub">
                            <span class="flex items-center">
                                <img src="assets/img/icons/github.svg" alt="" class="icon-sm mr-1">
                                GitHub
                            </span>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
}

// Filter projects by category and search term
function filterProjects() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active:not(#toggle-letter-nav)').getAttribute('data-filter');
    
    let filteredProjects = projectsData;
    
    // Apply category filter
    if (activeFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.category === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredProjects = filteredProjects.filter(project => 
            project.name.toLowerCase().includes(searchTerm) || 
            project.description.toLowerCase().includes(searchTerm) ||
            project.owner.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProjects(filteredProjects);
    
    // If letter navigation is active, reorganize by letter
    const letterNav = document.getElementById('letter-navigation');
    if (letterNav && !letterNav.classList.contains('hidden')) {
        // If we're using a module import for letter navigation
        if (typeof organizeProjectsByLetter === 'function') {
            organizeProjectsByLetter();
        }
    }
}

// Set up filter button click handlers
function setupFilterButtons() {
    // Need to query the buttons again in case new ones were added by letter-navigation.js
    const allFilterButtons = document.querySelectorAll('.filter-btn');
    
    allFilterButtons.forEach(button => {
        // Skip the toggle letter nav button
        if (button.id === 'toggle-letter-nav') return;
        
        button.addEventListener('click', () => {
            // Update active state
            allFilterButtons.forEach(btn => {
                if (btn.id !== 'toggle-letter-nav') {
                    btn.classList.remove('active', 'bg-bulgaria', 'text-white');
                    btn.classList.add('bg-white', 'text-gray-700');
                }
            });
            
            button.classList.add('active', 'bg-bulgaria', 'text-white');
            button.classList.remove('bg-white', 'text-gray-700');
            
            filterProjects();
        });
    });
}

// Set up modal functionality - keeping this for reference but it's no longer used
// The submit button now links directly to GitHub
function setupModal() {
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            submitModal.classList.add('hidden');
        });
        
        // Close modal when clicking outside
        submitModal.addEventListener('click', (e) => {
            if (e.target === submitModal) {
                submitModal.classList.add('hidden');
            }
        });
    }
}

// Initialize the application
async function init() {
    // Show loading spinner
    projectsGrid.innerHTML = `
        <div class="flex justify-center items-center col-span-full py-16">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-bulgaria"></div>
        </div>
    `;
    
    // Fetch projects data
    projectsData = await fetchProjects();
    
    // Render all projects
    renderProjects(projectsData);
    
    // Set up search functionality
    searchInput.addEventListener('input', filterProjects);
    
    // Set up filter buttons
    setupFilterButtons();
    
    // Set up the modal (mostly disabled, but keeping close button functionality)
    setupModal();
    
    // Initialize the letter-navigation toggle button
    const letterToggle = document.getElementById('toggle-letter-nav');
    if (letterToggle) {
        letterToggle.innerHTML = `
            <span class="flex items-center">
                <img src="assets/img/icons/font.svg" alt="" class="icon-sm mr-1">
                A-Z Navigation
            </span>
        `;
    }
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);