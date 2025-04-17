/**
 * This script reads the README.md file and generates a projects.json file
 * based on the alphabetically organized project information in the README.
 */

const fs = require('fs');
const path = require('path');

// Function to read the README.md file
function readReadmeFile() {
  try {
    // Check for both uppercase and lowercase readme files
    let readmePath = path.join(__dirname, 'README.md');
    if (!fs.existsSync(readmePath)) {
      readmePath = path.join(__dirname, 'readme.md');
    }
    return fs.readFileSync(readmePath, 'utf8');
  } catch (error) {
    console.error('Error reading README.md:', error);
    process.exit(1);
  }
}

// Function to parse project information from the README content
function parseProjects(readmeContent) {
  const projects = [];
  let id = 1;
  
  // Regular expression to match project entries in the new format
  const projectRegex = /\* (.*?) - (.*?) \*\*By @(.*?)\*\* \| (🚀 Active|🏁 Inactive|⚠️ Deprecated)/g;
  
  let match;
  while ((match = projectRegex.exec(readmeContent)) !== null) {
    const [_, name, description, githubUsername, status] = match;
    
    // Determine status based on emoji
    let statusValue = 'active';
    if (status.includes('Inactive')) {
      statusValue = 'inactive';
    } else if (status.includes('Deprecated')) {
      statusValue = 'deprecated';
    }
    
    // Determine category (this would need refinement based on your needs)
    // For now, assigning a default category based on description keywords
    let category = 'app';
    const descLower = description.toLowerCase();
    
    if (descLower.includes('framework') || descLower.includes('library')) {
      category = 'open-source';
    } else if (descLower.includes('api') || descLower.includes('tool')) {
      category = 'dev-tool';
    } else if (descLower.includes('service') || descLower.includes('platform')) {
      category = 'saas';
    }
    
    // Create the GitHub URL if username is available
    const github = githubUsername ? `https://github.com/${githubUsername}` : '';
    
    // Infer URL from name if not available (just a placeholder)
    const url = `https://${name.toLowerCase().replace(/\s+/g, '-')}.com`;
    
    // Try to estimate stars based on status (just placeholders)
    let stars = 0;
    if (statusValue === 'active') {
      stars = Math.floor(Math.random() * 1000) + 100; // Random number between 100-1100
    } else if (statusValue === 'inactive') {
      stars = Math.floor(Math.random() * 100); // Random number between 0-100
    }
    
    projects.push({
      id: id++,
      name,
      description,
      category,
      url,
      github,
      github_username: githubUsername,
      stars,
      owner: githubUsername,
      status: statusValue
    });
  }
  
  return projects;
}

// Function to write the projects.json file
function writeProjectsJson(projects) {
  try {
    const jsonContent = {
      projects
    };
    
    // Ensure the assets/js directory exists
    const outputDir = path.join(__dirname, 'assets', 'js');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write to the correct location
    const outputPath = path.join(outputDir, 'projects.json');
    fs.writeFileSync(outputPath, JSON.stringify(jsonContent, null, 2), 'utf8');
    console.log(`Successfully generated assets/js/projects.json with ${projects.length} projects.`);
  } catch (error) {
    console.error('Error writing projects.json:', error);
    process.exit(1);
  }
}

// Main function
function main() {
  console.log('Reading README.md and generating projects.json...');
  
  const readmeContent = readReadmeFile();
  const projects = parseProjects(readmeContent);
  
  if (projects.length === 0) {
    console.error('No projects found in README.md. Make sure the format is correct.');
    process.exit(1);
  }
  
  writeProjectsJson(projects);
}

// Run the script
main();