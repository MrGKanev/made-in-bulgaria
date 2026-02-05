/**
 * Generates individual project JSON files for Astro content collections
 * from README.md with real GitHub data.
 *
 * Fetches actual stars, descriptions, and URLs from GitHub API.
 * Supports GITHUB_TOKEN env variable for higher rate limits.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub API configuration
const GITHUB_API = 'api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Output directory for content collection
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'projects');

// Create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Read README.md
function readReadme() {
  const paths = [
    path.join(__dirname, '..', 'readme.md'),
    path.join(__dirname, '..', 'README.md')
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }

  console.error('Error: README.md not found');
  process.exit(1);
}

// Parse projects from README content
function parseReadme(content) {
  const projects = [];
  const regex = /\* (.+?) - (.+?) \*\*By @(.+?)\*\* \| (🚀 Active|🏁 Inactive|⚠️ Deprecated)/g;

  // Stop parsing at "How to Add" section (template examples)
  const contentEnd = content.indexOf('## How to Add');
  const parseContent = contentEnd > 0 ? content.substring(0, contentEnd) : content;

  let match;
  while ((match = regex.exec(parseContent)) !== null) {
    const [, name, description, username, statusText] = match;

    let status = 'active';
    if (statusText.includes('Inactive')) status = 'inactive';
    else if (statusText.includes('Deprecated')) status = 'deprecated';

    // Determine category from description
    let category = 'app';
    const desc = description.toLowerCase();
    if (desc.includes('framework') || desc.includes('library') || desc.includes('open-source')) {
      category = 'open-source';
    } else if (desc.includes('api') || desc.includes('tool') || desc.includes('developer')) {
      category = 'dev-tool';
    } else if (desc.includes('platform') || desc.includes('service') || desc.includes('saas')) {
      category = 'saas';
    }

    projects.push({
      name: name.trim(),
      description: description.trim(),
      github_username: username.trim(),
      status,
      category
    });
  }

  return projects;
}

// Fetch GitHub data using https module (safe - no shell execution)
function fetchGitHub(endpoint) {
  return new Promise((resolve) => {
    const headers = {
      'User-Agent': 'made-in-bulgaria-generator',
      'Accept': 'application/vnd.github.v3+json'
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = 'Bearer ' + GITHUB_TOKEN;
    }

    const options = {
      hostname: GITHUB_API,
      path: endpoint,
      method: 'GET',
      headers
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(null);
          }
        } else if (res.statusCode === 403) {
          console.warn('GitHub API rate limit reached. Using fallback data.');
          resolve(null);
        } else {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

// Get most popular repo for a user/org
async function getPopularRepo(username) {
  const repos = await fetchGitHub('/users/' + username + '/repos?sort=stars&per_page=5');

  if (!repos || repos.length === 0) return null;

  // Return the most starred repo
  return repos.reduce((max, repo) =>
    (repo.stargazers_count > (max?.stargazers_count || 0)) ? repo : max
  , null);
}

// Enrich project with GitHub data
async function enrichProject(project, index) {
  const { name, description, github_username, status, category } = project;

  console.log('[' + (index + 1) + '] Fetching data for ' + name + '...');

  // Try to find the best repo
  const repo = await getPopularRepo(github_username);

  // Build enriched project
  const slug = createSlug(name);
  const enriched = {
    name,
    slug,
    description: repo?.description || description,
    category,
    url: repo?.homepage || repo?.html_url || 'https://github.com/' + github_username,
    github: 'https://github.com/' + github_username,
    github_username,
    stars: repo?.stargazers_count || 0,
    owner: github_username,
    status
  };

  // Add delay to respect rate limits
  await new Promise(r => setTimeout(r, 100));

  return enriched;
}

// Write individual project JSON files
function writeProjectFiles(projects) {
  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  // Clean existing project files
  const existingFiles = fs.readdirSync(CONTENT_DIR);
  for (const file of existingFiles) {
    if (file.endsWith('.json')) {
      fs.unlinkSync(path.join(CONTENT_DIR, file));
    }
  }

  // Write each project as individual JSON file
  for (const project of projects) {
    const filename = project.slug + '.json';
    const filepath = path.join(CONTENT_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(project, null, 2), 'utf8');
  }

  console.log('\nGenerated ' + projects.length + ' project files in src/content/projects/');
}

// Main
async function main() {
  console.log('Generating project content from README.md...');

  if (GITHUB_TOKEN) {
    console.log('Using GitHub token for higher rate limits.');
  } else {
    console.log('No GITHUB_TOKEN set. Using anonymous requests (60/hour limit).');
  }

  const content = readReadme();
  const parsed = parseReadme(content);

  if (parsed.length === 0) {
    console.error('No projects found. Check README.md format.');
    process.exit(1);
  }

  console.log('Found ' + parsed.length + ' projects. Fetching GitHub data...\n');

  const enriched = [];
  for (let i = 0; i < parsed.length; i++) {
    const project = await enrichProject(parsed[i], i);
    enriched.push(project);
  }

  // Sort by stars descending
  enriched.sort((a, b) => b.stars - a.stars);

  writeProjectFiles(enriched);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
