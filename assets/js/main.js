// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const submitButton = document.getElementById('submit-project');
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
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        <span>${project.stars}</span>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">${project.description}</p>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <span class="mr-4">by ${project.owner}</span>
                    <div class="flex space-x-2">
                        <span class="px-2 py-1 bg-gray-100 rounded-full capitalize">${project.category.replace('-', ' ')}</span>
                        ${project.status ? `<span class="px-2 py-1 rounded-full ${statusClass}">${statusLabel}</span>` : ''}
                    </div>
                </div>
                <div class="flex justify-between">
                    <a href="${project.url}" target="_blank" class="text-bulgaria hover:underline font-medium">
                        <i class="fas fa-external-link-alt mr-1"></i> Visit
                    </a>
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" class="text-gray-700 hover:text-gray-900">
                            <i class="fab fa-github mr-1"></i> GitHub
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
    filterButtons.forEach(button => {
        // Skip the toggle letter nav button
        if (button.id === 'toggle-letter-nav') return;
        
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => {
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

// Set up modal functionality
function setupModal() {
    submitButton.addEventListener('click', () => {
        submitModal.classList.remove('hidden');
    });
    
    closeModal.addEventListener('click', () => {
        submitModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    submitModal.addEventListener('click', (e) => {
        if (e.target === submitModal) {
            submitModal.classList.add('hidden');
        }
    });
    
    // Form submission
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const newProject = {
            id: projectsData.length + 1,
            name: document.getElementById('project-name').value,
            description: document.getElementById('project-description').value,
            url: document.getElementById('project-url').value,
            github: document.getElementById('project-github').value,
            category: document.getElementById('project-category').value,
            github_username: document.getElementById('project-github').value.split('/').pop(),
            stars: 0,
            owner: "Submitted Project", // In a real app, this would be the user's organization
            status: "active"
        };
        
        // In a real application, this would send data to a server
        alert('Project submitted successfully! It will be reviewed soon.');
        submitModal.classList.add('hidden');
        projectForm.reset();
        
        // Optionally add to local data for immediate display
        // projectsData.push(newProject);
        // filterProjects();
    });
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
    
    // Set up modal
    setupModal();
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);