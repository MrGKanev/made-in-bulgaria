# Contributing to Made in Bulgaria

First off, thank you for considering contributing to Made in Bulgaria! It's people like you that make this showcase of Bulgarian tech innovation possible.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Issues](#issues)
  - [Pull Requests](#pull-requests)
- [Project Structure](#project-structure)
- [Adding a New Project](#adding-a-new-project)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

Contributions to Made in Bulgaria are made primarily through issues and pull requests.

### Issues

- **Bug Reports**: If you find a bug, please create an issue describing the problem and include steps to reproduce it.
- **Feature Requests**: For new features or improvements, create an issue describing what you'd like to see.
- **Questions**: For general questions about the project, please use the Discussions section.

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

## Project Structure

```
made-in-bulgaria/
├── assets/
│   ├── img/
│   └── js/
│       ├── main.js              # Main JavaScript functionality
│       ├── letter-navigation.js # Alphabet navigation
│       └── projects.json        # Generated projects data
│       └── generate.js          # Script to generate projects.json
├── index.html                   # Main page
├── README.md                    # Project documentation
├── LICENSE                      # MIT License
├── package.json                 # NPM package configuration       
└── CONTRIBUTING.md              # This file
```

## Adding a New Project

To add a new project to the showcase:

1. Fork the repository
2. Edit the README.md file, adding your project to the appropriate alphabetical section
3. Use the following format:

```
* Project Name - Brief description of the project. **By @githubusername** | 🚀 Active/🏁 Inactive/⚠️ Deprecated
```

Where:

- **Project Name**: The name of your project
- **Brief description**: A concise description of what your project does (keep it under 200 characters)
- **githubusername**: Your GitHub username or organization
- **Status**: Current status of the project (Active, Inactive, or Deprecated)

4. Submit a pull request with your addition

### Project Quality Guidelines

While everyone is welcome to submit their projects, we maintain certain quality standards:

- **Project usage requirement**: Projects should demonstrate actual usage and value. Submissions that appear to be unused or created solely for link-building purposes may be removed.
- **Multiple submissions**: Contributors submitting multiple projects should ensure each project has genuine usage and community value.
- **Social proof requirement**: Projects should have some demonstrable community interest (minimum 10 GitHub stars or equivalent social proof). This helps ensure quality and relevance to the community.
- **Maintainer discretion**: Project maintainers may remove listings that don't meet community standards or lack sufficient community engagement.

Remember, this showcase is intended to highlight quality Bulgarian projects that provide value to the broader community, not to serve as a repository for dormant or unused projects.

The project will be automatically added to the website when your PR is merged.

## Development Setup

If you want to work on the website itself:

1. Clone your forked repository

   ```
   git clone https://github.com/mrgkanev/made-in-bulgaria.git
   cd made-in-bulgaria
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Generate the projects.json file

   ```
   npm run generate
   ```

4. Compile CSS styles for development (with watch mode)

   ```
   npx @tailwindcss/cli -i ./assets/css/input.css -o ./assets/css/output.css --watch
   ```

5. For production builds (minified CSS)

   ```
   npx @tailwindcss/cli -i ./assets/css/input.css -o ./assets/css/output.css --minify
   ```

6. Start the development server

   ```
   npm start
   ```

7. Visit `http://localhost:5000` in your browser

## Style Guidelines

### JavaScript

- Use ES6+ syntax where possible
- Follow the existing code style (spacing, indentation, etc.)
- Comment complex code sections
- Write meaningful commit messages

### HTML/CSS

- Use semantic HTML elements
- Maintain the existing design language
- Keep accessibility in mind (appropriate alt texts, ARIA attributes, etc.)

## Community

Join our community:

- **GitHub Discussions**: For general questions and discussions
- **Issues**: For bug reports and feature requests
- **Twitter**: Follow us for updates and announcements

We look forward to your contributions!

---

This document is subject to change. Contributors are encouraged to check for updates before making contributions.
