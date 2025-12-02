# Contributing to NebulaGateAI

Thank you for your interest in contributing to NebulaGateAI! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- Use cases and benefits
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create a new branch from `main`
2. **Name your branch** descriptively (e.g., `feature/add-export-button` or `fix/cache-bug`)
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** with clear, descriptive messages
6. **Push to your fork** and submit a pull request

## Development Setup

1. Clone your fork:
```bash
git clone https://github.com/your-username/nebula-gate-ai.git
cd nebula-gate-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Make your changes and test locally

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Follow React best practices
- Keep components focused and single-purpose
- Use proper prop typing

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design (mobile, tablet, desktop)
- Use the custom color palette defined in tailwind.config.ts

### Code Quality
- Write clean, readable code
- Add comments for complex logic
- Follow the existing code structure
- Keep functions small and focused

## Commit Messages

Write clear commit messages following this format:

```
type: brief description

Longer description if needed

Fixes #issue-number
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat: add export to CSV functionality

fix: resolve caching bug in NeMo configuration

docs: update installation instructions
```

## Testing

Before submitting a PR:
- Test all functionality you've modified
- Check for console errors
- Test on different screen sizes
- Verify TypeScript compilation: `npm run type-check`
- Run linting: `npm run lint`

## Pull Request Process

1. Update README.md if needed
2. Update documentation for any new features
3. Ensure all tests pass
4. Request review from maintainers
5. Address any feedback
6. Once approved, your PR will be merged

## Questions?

Feel free to open an issue for any questions about contributing!

## Recognition

Contributors will be recognized in our README and release notes.

Thank you for contributing to NebulaGateAI! 🌌
