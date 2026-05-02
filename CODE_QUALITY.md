# Code Quality Guide

## Overview
This document outlines the code quality standards, testing practices, and development workflows for the TeamSync project.

---

## Code Quality Standards

### ESLint Configuration
The project uses ESLint with the following plugins:
- `eslint-plugin-react` - React-specific linting rules
- `eslint-plugin-react-hooks` - Enforces Rules of Hooks
- `eslint-plugin-jsx-a11y` - Accessibility linting for JSX

### Running Linting
```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Code Style Guidelines

#### React Components
- Use functional components with hooks
- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking

#### Naming Conventions
- Components: PascalCase (e.g., `TaskCard.jsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useFirestore.js`)
- Contexts: PascalCase with 'Context' suffix (e.g., `AuthContext.jsx`)
- Utilities: camelCase (e.g., `formatDate.js`)

#### File Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── auth/         # Authentication components
│   └── [feature]/    # Feature-specific components
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── tests/            # Test files
│   ├── components/   # Component tests
│   ├── contexts/     # Context tests
│   ├── hooks/        # Hook tests
│   └── e2e/          # End-to-end tests
└── config/           # Configuration files
```

---

## Testing Strategy

### Test Coverage Goals
- **Unit Tests**: 80% coverage for utilities and hooks
- **Component Tests**: 70% coverage for UI components
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main user journeys

### Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests
npm run test:all
```

### Unit Testing

**Tools**: Jest + React Testing Library

**Example**:
```javascript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

**Best Practices**:
- Test user behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Mock external dependencies (Firebase, APIs)
- Keep tests isolated and independent

### E2E Testing

**Tools**: Playwright

**Example**:
```javascript
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /sign up/i }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

**Best Practices**:
- Test critical user journeys
- Use data-testid sparingly, prefer semantic selectors
- Clean up test data after each test
- Run E2E tests in CI/CD pipeline

---

## Error Handling

### Error Boundary
All routes are wrapped with `ErrorBoundary` component:
- Catches React component errors
- Displays user-friendly error message
- Provides "Try Again" and "Go Home" actions
- Shows stack trace in development mode

### Context Error Handling
All contexts handle errors gracefully:
```javascript
try {
  setError(null);
  await someOperation();
} catch (err) {
  setError(err.message);
  throw err;
}
```

### Loading States
Use loading components for better UX:
- `LoadingSpinner` - Inline spinner
- `FullPageLoader` - Full-page loading screen
- `CardLoader` - Skeleton loading for cards
- `Skeleton` - Generic skeleton component

---

## Performance Optimization

### Code Splitting
Use React.lazy for route-based code splitting:
```javascript
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

### Memoization
Use React.memo, useMemo, useCallback appropriately:
```javascript
const MemoizedComponent = React.memo(ExpensiveComponent);
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### React Query Caching
Configure appropriate stale times:
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

---

## Accessibility

### WCAG 2.1 Level AA Compliance

**Keyboard Navigation**:
- All interactive elements are keyboard accessible
- Visible focus indicators
- Logical tab order

**Semantic HTML**:
- Use proper heading hierarchy (h1, h2, h3)
- Use semantic elements (nav, main, article, section)
- Label all form inputs

**ARIA Attributes**:
- Add aria-label for icon-only buttons
- Use aria-describedby for form errors
- Implement aria-live for dynamic content

**Color Contrast**:
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Use TailwindCSS default colors (WCAG compliant)

### Testing Accessibility
```bash
# Run ESLint with jsx-a11y plugin
npm run lint

# Manual testing with screen reader (NVDA/JAWS)
# Use browser DevTools Lighthouse audit
```

---

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding tests
- `docs/documentation-update` - Documentation

### Commit Messages
Follow conventional commits:
```
feat: add task filtering by status
fix: resolve authentication redirect loop
refactor: extract task card into separate component
test: add unit tests for AuthContext
docs: update deployment guide
```

### Pull Request Checklist
- [ ] Code passes linting (`npm run lint`)
- [ ] All tests pass (`npm run test:all`)
- [ ] New features have tests
- [ ] Documentation updated
- [ ] Accessibility checked
- [ ] No console errors or warnings

---

## Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run lint:fix`
- [ ] Run `npm run test:coverage` (>70%)
- [ ] No TypeScript/PropTypes errors
- [ ] Remove all console.log statements

### Performance
- [ ] Bundle size analyzed
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading for routes

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables configured
- [ ] Firebase security rules deployed
- [ ] HTTPS enforced

### Accessibility
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] ARIA labels added

### Testing
- [ ] All unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

---

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run build
```

---

## Monitoring and Logging

### Error Tracking
- Use Firebase Crashlytics for production errors
- Log errors to console in development
- Track error rates in Firebase Analytics

### Performance Monitoring
- Firebase Performance Monitoring
- Web Vitals tracking
- Lighthouse CI in pipeline

---

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Testing Library](https://testing-library.com)
- [Playwright](https://playwright.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Jest](https://jestjs.io)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## Getting Help

### Code Review
- Request reviews from team members
- Address all review comments
- Keep PRs small and focused

### Questions
- Check existing documentation first
- Search GitHub issues
- Ask in team chat
- Create detailed issue reports

---

**Last Updated**: May 2, 2026
**Maintained By**: TeamSync Development Team
