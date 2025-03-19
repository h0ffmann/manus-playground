# CLAUDE.md - Development Guide

## Build/Lint/Test Commands
- Build: `npm run build` or `just build`
- Test: `npm run test` or `just test`
- Test frontend: `cd frontend && npm test` or `just test-frontend`
- Test backend: `cd backend && npm test` or `just test-backend`
- Lint: `npm run lint` or `just lint`
- Format: `just format`
- Dev: `npm run dev` or `just dev`

## Testing Projects

### Manus EC2 Browser Automation
- Install dependencies: `cd manus_clone && npm run install:all`
- Run development server: `cd manus_clone && npm run dev`
- Test services: 
  - Backend: `cd manus_clone/backend && npm test`
  - Frontend: `cd manus_clone/frontend && npm test`

### Women's Business Consultancy
- Run local server: `cd women_biz && npx http-server -p 8000`
- Generate report: `cd women_biz && node generate-report.js --tipo=airbnb --estagio=operacao_inicial --email=test@example.com`

### Philosophy Website
- Run local server: `cd philosophy_website && npx http-server -p 8000`

## Code Style Guidelines
- Follow TypeScript conventions; use .ts/.tsx extensions
- Path aliases: use @frontend/, @backend/, @ec2/, @utils/
- Component structure: separate CSS files for each component
- Commit messages: present tense, imperative mood, 72 char limit first line
- Follow existing code patterns in the repository
- Redux for state management in frontend
- Comments where necessary, especially for complex logic
- Write tests for new features
- Error handling: consistent approach matching existing patterns
- Use established project structure (backend/frontend split)

## Project Architecture
- Manus Clone: Full-stack TypeScript application with React frontend and Node.js backend
- Women Biz: Static HTML/CSS/JS business consultancy form with report generation
- Philosophy Website: Static website comparing Pirsig and Nietzsche philosophical concepts