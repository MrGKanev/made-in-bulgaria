/**
 * This script reads the README.md file and generates a projects.json file
 * based on the project information in the README.
 */

const fs = require('fs');
const path = require('path');

// Function to read the README.md file
function readReadmeFile() {
  try {
    const readmePath = path.join(__dirname, 'README.md');
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
  
  // Regular expression to match project entries
  const projectRegex = /### \[(.*?)\]\((.*?)\)\s*\n- \*\*Description\*\*: (.*?)\s*\n- \*\*Category\*\*: (.*?)\s*\n- \*\*GitHub\*\*: (.*?)\s*\n- \*\*Owner\*\*: (.*?)\s*\n- \*\*Stars\*\*: (.*?)\s*\n/g;
  
  let match;
  while ((match = projectRegex.exec(readmeContent)) !== null) {
    const [_, name, url, description, category, github, owner, starsStr] = match;
    
    // Convert stars to a number
    const stars = parseInt(starsStr, 10) || 0;
    
    projects.push({
      id: id++,
      name,
      description,
      category,
      url,
      github: github.trim(),
      image: "https://via.placeholder.com/300x200",
      stars,
      owner
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
    
    const outputPath = path.join(__dirname, 'projects.json');
    fs.writeFileSync(outputPath, JSON.stringify(jsonContent, null, 2), 'utf8');
    console.log(`Successfully generated projects.json with ${projects.length} projects.`);
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