# Manus Playground Repository

This repository contains a collection of diverse projects that demonstrate different web development approaches and technologies.

## Projects Overview

### 1. Manus EC2 Browser Automation

A full-stack TypeScript application that allows remote browser automation using AWS EC2 instances.

**Key Features:**
- Remote browser automation via EC2 instances
- User authentication and session management
- EC2 instance provisioning and management
- Real-time browser interaction via WebSockets
- React frontend with Redux state management

**Technologies:**
- TypeScript
- React
- Node.js with Express
- Socket.IO
- AWS SDK
- Puppeteer

**Directory:** `/manus_clone`

### 2. Women's Business Consultancy

A static website that offers business consultancy services for women entrepreneurs, featuring a multi-step form that generates personalized business reports.

**Key Features:**
- Multi-step interactive form
- Business type-specific questions
- Email report generation and delivery
- Mobile-responsive design

**Technologies:**
- HTML5/CSS3
- Vanilla JavaScript
- EmailJS integration
- Node.js report generation script

**Directory:** `/women_biz`

### 3. Philosophy Website

A static website exploring the philosophical connections between Robert M. Pirsig and Friedrich Nietzsche, with interactive elements to explore common themes.

**Key Features:**
- Interactive exploration of philosophical concepts
- Responsive design with expandable content sections
- Visual comparisons of philosophical frameworks

**Technologies:**
- HTML5/CSS3
- JavaScript
- CSS animations

**Directory:** `/philosophy_website`

### 4. Philosophy Comparison

Research and documentation comparing the philosophical concepts of Pirsig, Nietzsche, and Greek philosophy.

**Key Features:**
- Detailed analysis of philosophical connections
- Comprehensive research documents
- Structured comparison framework

**Technologies:**
- Markdown
- PDF documentation

**Directory:** `/philosophy_comparison`

## Getting Started

Each project has its own setup instructions. Navigate to the specific project directory and follow the instructions in its README file.

### Quick Start Commands

```bash
# Manus EC2 Browser Automation
cd manus_clone
npm run install:all
npm run dev

# Women's Business Consultancy
cd women_biz
npx http-server -p 8000

# Philosophy Website
cd philosophy_website
npx http-server -p 8000
```

## Development

For development guidelines, see the [CLAUDE.md](./CLAUDE.md) file which contains:
- Build, lint, and test commands
- Code style guidelines
- Project architecture details
- Testing instructions

## License

Each project is licensed under its respective license. See the LICENSE file in each project directory for details.