# 🔧 Development Guide

This comprehensive guide covers everything you need to know about developing the LifeSmart Calculator application.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Code Style Guidelines](#code-style-guidelines)
- [Component Development](#component-development)
- [State Management](#state-management)
- [Testing](#testing)
- [Performance](#performance)
- [Debugging](#debugging)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** 2.0.0 or higher
- **VS Code** (recommended) with extensions

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/lifesmart-calculator.git
   cd lifesmart-calculator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### VS Code Setup

Install the recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## Development Environment

### Environment Variables

Create environment-specific configuration files:

#### `.env.development`
```env
REACT_APP_ENVIRONMENT=development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GA_TRACKING_ID=
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_DEBUG=true
```

#### `.env.local` (ignored by git)
```env
# Local development overrides
REACT_APP_DEBUG=true
REACT_APP_MOCK_API=true
```

### Development Scripts

```bash
# Development
npm start              # Start development server
npm run build          # Build for production
npm test               # Run unit tests
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run type-check     # Run TypeScript compiler

# Performance
npm run lighthouse     # Run Lighthouse CI
npm run bundle-size    # Check bundle size
npm run bundle-analyzer # Analyze bundle composition

# Dependencies
npm run deps:check     # Check for updates
npm run deps:update    # Update dependencies
npm run deps:audit     # Security audit
npm run deps:audit:fix # Fix security issues

# Pre-commit
npm run pre-commit     # Run all quality checks
```

### Hot Reloading

The development server supports hot reloading for:
- **React Components** - Component changes reload instantly
- **CSS Changes** - Style changes apply without page refresh
- **TypeScript** - Type errors show in console and overlay

---

## Project Structure

```
src/
├── components/           # React components
│   ├── CreditCardCalculator.tsx
│   └── InvestmentChart.tsx
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── utils/               # Utility functions
│   ├── calculations.ts
│   ├── formatters.ts
│   └── validators.ts
├── types/               # TypeScript type definitions
│   ├── calculator.ts
│   ├── chart.ts
│   └── svg.d.ts
├── styles/              # Global styles
│   ├── globals.css
│   └── components.css
├── constants/           # Application constants
│   ├── defaults.ts
│   └── limits.ts
├── config/              # Configuration files
│   ├── environment.ts
│   └── chart.ts
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
└── reportWebVitals.ts   # Performance monitoring
```

### Component Organization

#### Component Structure
```typescript
// components/ComponentName.tsx
import React, { useState, useEffect } from 'react';
import { ComponentProps } from '../types/component';

interface ComponentNameProps {
  // Props interface
}

const ComponentName: React.FC<ComponentNameProps> = ({
  // Destructured props
}) => {
  // Hooks
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = (event: EventType) => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

#### File Naming Conventions

- **Components**: PascalCase (e.g., `CreditCardCalculator.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLocalStorage.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: camelCase (e.g., `calculatorTypes.ts`)
- **Constants**: camelCase (e.g., `defaultValues.ts`)

---

## Code Style Guidelines

### TypeScript Guidelines

#### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type aliases for unions and primitives
type Status = 'loading' | 'success' | 'error';
type ID = string | number;

// Use generic types for reusable components
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

#### Function Declarations
```typescript
// Use function declarations for main functions
function calculateInterest(principal: number, rate: number): number {
  return principal * rate;
}

// Use arrow functions for callbacks and short functions
const formatCurrency = (amount: number): string => 
  `$${amount.toLocaleString()}`;

// Use async/await for promises
const fetchData = async (url: string): Promise<ApiResponse<User>> => {
  const response = await fetch(url);
  return response.json();
};
```

#### React Component Patterns
```typescript
// Use functional components with hooks
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<StateType>(initialValue);
  
  return <div>{/* JSX */}</div>;
};

// Use React.memo for performance optimization
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useCallback for event handlers
const handleClick = useCallback((id: string) => {
  // Handler logic
}, [dependencies]);
```

### Styling Guidelines

#### Tailwind CSS Usage
```tsx
// Use utility classes for styling
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>

// Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>

// Use dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  {/* Dark mode support */}
</div>
```

#### Custom CSS Classes
```css
/* Use @apply for component-specific styles */
.btn-primary {
  @apply bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200;
}

.card {
  @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
}

/* Use CSS custom properties for dynamic values */
.slider {
  background: linear-gradient(
    to right,
    #3b82f6 0%,
    #3b82f6 var(--value, 0%),
    #e5e7eb var(--value, 0%),
    #e5e7eb 100%
  );
}
```

### Naming Conventions

#### Variables and Functions
```typescript
// Use camelCase for variables and functions
const monthlySpend = 2000;
const calculateInterest = (principal: number) => principal * 0.05;

// Use descriptive names
const isUserLoggedIn = true;
const handleFormSubmit = (event: FormEvent) => {};

// Use boolean prefixes
const hasError = false;
const canEdit = true;
const shouldUpdate = false;
```

#### Constants
```typescript
// Use UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'https://api.example.com';

// Use const assertions for readonly objects
const DEFAULT_VALUES = {
  MONTHLY_SPEND: 2000,
  APR: 23,
  TIME_PERIOD: 10,
} as const;
```

#### Components and Types
```typescript
// Use PascalCase for components and types
interface CalculatorProps {
  monthlySpend: number;
  apr: number;
}

const CreditCardCalculator: React.FC<CalculatorProps> = ({ monthlySpend, apr }) => {
  return <div>{/* Component JSX */}</div>;
};
```

---

## Component Development

### Component Lifecycle

#### Functional Components with Hooks
```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';

const MyComponent: React.FC<Props> = ({ initialValue, onChange }) => {
  // State
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  
  // Computed values
  const computedValue = useMemo(() => {
    return value * 2;
  }, [value]);
  
  // Event handlers
  const handleChange = useCallback((newValue: number) => {
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);
  
  // Effects
  useEffect(() => {
    // Component mount
    console.log('Component mounted');
    
    return () => {
      // Component unmount
      console.log('Component unmounted');
    };
  }, []);
  
  useEffect(() => {
    // Value change effect
    if (value > 0) {
      setIsLoading(true);
      // Simulate async operation
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [value]);
  
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>Value: {computedValue}</div>
      )}
    </div>
  );
};
```

### Props and State Management

#### Props Interface
```typescript
interface CalculatorProps {
  // Required props
  monthlySpend: number;
  apr: number;
  
  // Optional props
  onCalculate?: (result: CalculationResult) => void;
  className?: string;
  
  // Default props
  timePeriod?: number;
  returnRate?: number;
}

// Default props
const defaultProps: Partial<CalculatorProps> = {
  timePeriod: 10,
  returnRate: 9,
  className: '',
};
```

#### State Management Patterns
```typescript
// Simple state
const [value, setValue] = useState(0);

// Complex state with useReducer
interface State {
  monthlySpend: number;
  apr: number;
  timePeriod: number;
  isLoading: boolean;
  error: string | null;
}

type Action = 
  | { type: 'SET_MONTHLY_SPEND'; payload: number }
  | { type: 'SET_APR'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MONTHLY_SPEND':
      return { ...state, monthlySpend: action.payload };
    case 'SET_APR':
      return { ...state, apr: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, initialState);
```

### Event Handling

#### Form Handling
```typescript
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // Handle form submission
};
```

#### Custom Event Handlers
```typescript
const handleSliderChange = useCallback((value: number) => {
  setBalanceCarriedPercent(value);
  
  // Update CSS custom property for visual feedback
  document.documentElement.style.setProperty('--value', `${value}%`);
}, []);

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    // Handle enter key
  }
};
```

---

## State Management

### Local State

#### useState Hook
```typescript
// Simple state
const [count, setCount] = useState(0);

// State with initializer function
const [data, setData] = useState(() => {
  const saved = localStorage.getItem('calculator-data');
  return saved ? JSON.parse(saved) : initialData;
});

// State with type annotation
const [user, setUser] = useState<User | null>(null);
```

#### useReducer Hook
```typescript
interface CalculatorState {
  monthlySpend: number;
  apr: number;
  timePeriod: number;
  results: CalculationResults | null;
  isLoading: boolean;
  error: string | null;
}

const calculatorReducer = (state: CalculatorState, action: CalculatorAction): CalculatorState => {
  switch (action.type) {
    case 'SET_MONTHLY_SPEND':
      return { ...state, monthlySpend: action.payload };
    case 'SET_APR':
      return { ...state, apr: action.payload };
    case 'CALCULATE_START':
      return { ...state, isLoading: true, error: null };
    case 'CALCULATE_SUCCESS':
      return { ...state, isLoading: false, results: action.payload };
    case 'CALCULATE_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
```

### Global State

#### Context API
```typescript
// Create context
interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);
  
  const value = useMemo(() => ({
    theme,
    setTheme,
    user,
    setUser,
  }), [theme, user]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

### Data Persistence

#### localStorage Hook
```typescript
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
```

---

## Testing

### Unit Testing

#### Component Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditCardCalculator from '../CreditCardCalculator';

describe('CreditCardCalculator', () => {
  it('renders calculator form', () => {
    render(<CreditCardCalculator />);
    
    expect(screen.getByText('Your current card — inputs')).toBeInTheDocument();
    expect(screen.getByPlaceholder('2000')).toBeInTheDocument();
    expect(screen.getByPlaceholder('23')).toBeInTheDocument();
  });

  it('calculates interest correctly', async () => {
    const user = userEvent.setup();
    render(<CreditCardCalculator />);
    
    const monthlySpendInput = screen.getByPlaceholder('2000');
    const aprInput = screen.getByPlaceholder('23');
    
    await user.clear(monthlySpendInput);
    await user.type(monthlySpendInput, '3000');
    
    await user.clear(aprInput);
    await user.type(aprInput, '25');
    
    await waitFor(() => {
      expect(screen.getByText(/Annual Interest:/)).toBeInTheDocument();
    });
  });

  it('handles invalid input gracefully', async () => {
    const user = userEvent.setup();
    render(<CreditCardCalculator />);
    
    const monthlySpendInput = screen.getByPlaceholder('2000');
    
    await user.clear(monthlySpendInput);
    await user.type(monthlySpendInput, 'invalid');
    
    // Should not crash and should show default value
    expect(monthlySpendInput).toHaveValue('');
  });
});
```

#### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('updates stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });
});
```

#### Utility Function Testing
```typescript
import { calculateCompoundInterest } from '../utils/calculations';

describe('calculateCompoundInterest', () => {
  it('calculates compound interest correctly', () => {
    const result = calculateCompoundInterest(0, 500, 0.09, 10);
    
    expect(result.totalValue).toBeCloseTo(95650.23, 2);
    expect(result.totalInvested).toBe(60000);
    expect(result.interestEarned).toBeCloseTo(35650.23, 2);
  });

  it('handles zero values', () => {
    const result = calculateCompoundInterest(0, 0, 0, 0);
    
    expect(result.totalValue).toBe(0);
    expect(result.totalInvested).toBe(0);
    expect(result.interestEarned).toBe(0);
  });
});
```

### Integration Testing

#### E2E Testing with Playwright
```typescript
import { test, expect } from '@playwright/test';

test.describe('LifeSmart Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should calculate interest correctly', async ({ page }) => {
    // Fill in test values
    await page.fill('[placeholder="2000"]', '3000');
    await page.fill('[placeholder="23"]', '25');
    await page.fill('input[type="range"]', '30');

    // Wait for calculations to update
    await page.waitForTimeout(1000);

    // Check if results are displayed
    await expect(page.getByText('Annual Interest:')).toBeVisible();
    await expect(page.getByText('Monthly Savings:')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    const darkModeToggle = page.locator('button').filter({ hasText: '🌙' });
    await expect(darkModeToggle).toBeVisible();
    
    await darkModeToggle.click();
    
    await expect(page.locator('button').filter({ hasText: '☀️' })).toBeVisible();
  });
});
```

### Test Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Test Setup
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

---

## Performance

### Optimization Techniques

#### React.memo
```typescript
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.length === nextProps.data.length;
});
```

#### useMemo and useCallback
```typescript
const MyComponent: React.FC<Props> = ({ items, filter }) => {
  // Memoize expensive calculations
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  // Memoize event handlers
  const handleItemClick = useCallback((id: string) => {
    // Handle click
  }, []);

  // Memoize JSX
  const itemList = useMemo(() => (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  ), [filteredItems, handleItemClick]);

  return <div>{itemList}</div>;
};
```

#### Code Splitting
```typescript
// Lazy load components
const LazyChart = lazy(() => import('./InvestmentChart'));

const MyComponent = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <LazyChart />
        </Suspense>
      )}
    </div>
  );
};
```

### Bundle Analysis

#### Webpack Bundle Analyzer
```bash
# Analyze bundle size
npm run bundle-analyzer

# Check bundle size limits
npm run bundle-size
```

#### Bundle Optimization
```typescript
// Dynamic imports for large libraries
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

// Tree shaking friendly imports
import { debounce } from 'lodash/debounce';
// Instead of: import _ from 'lodash';
```

---

## Debugging

### Development Tools

#### React Developer Tools
- Install React DevTools browser extension
- Use Profiler tab for performance debugging
- Use Components tab for state inspection

#### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Console Debugging

#### Debug Logging
```typescript
// Conditional logging
const debug = process.env.NODE_ENV === 'development';

if (debug) {
  console.log('Component rendered with props:', props);
  console.log('State updated:', state);
}

// Performance timing
const startTime = performance.now();
// ... expensive operation
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);
```

#### Error Boundaries
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send error to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Local Workflow Testing

### Testing GitHub Actions Locally with `act`

You can test your GitHub Actions workflows locally before pushing changes using [`act`](https://github.com/nektos/act), which runs GitHub Actions in Docker containers.

#### Installation

**Windows (using Chocolatey):**
```bash
choco install act-cli
```

**macOS (using Homebrew):**
```bash
brew install act
```

**Linux (using the install script):**
```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

**Or download from releases:**
Visit [act releases](https://github.com/nektos/act/releases) and download the appropriate binary for your platform.

#### Prerequisites

1. **Docker Desktop** must be installed and running
   - Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Ensure Docker is running before using `act`

#### Basic Usage

**List all workflows:**
```bash
act -l
```

**Run a specific workflow:**
```bash
# Run the CI workflow
act push

# Run a specific job
act -j quality-checks

# Run with a specific event
act pull_request
```

**Run with environment variables:**
```bash
# Set Node.js version
act -e .github/workflows/ci.yml --env NODE_VERSION=22

# Or use a secrets file
act --secret-file .secrets
```

#### Creating a Secrets File

Create a `.secrets` file in your project root (add to `.gitignore`):

```bash
# .secrets
GITHUB_TOKEN=your_personal_access_token
SNYK_TOKEN=your_snyk_token
SEMGREP_APP_TOKEN=your_semgrep_token
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token
```

**Note:** For testing PR creation workflows, you'll need a GitHub Personal Access Token with `repo` permissions.

#### Testing Specific Workflows

**Test CI workflow:**
```bash
# Simulate a push event
act push

# Simulate a pull request
act pull_request

# Run specific job
act -j quality-checks
```

**Test security workflow:**
```bash
act -W .github/workflows/security.yml
```

**Test performance workflow:**
```bash
act -W .github/workflows/performance.yml
```

**Test dependencies workflow:**
```bash
act -W .github/workflows/dependencies.yml workflow_dispatch
```

#### Advanced Options

**Use a specific runner image:**
```bash
# Use a larger image with more tools
act -P ubuntu-latest=catthehacker/ubuntu:act-latest
```

**Dry run (list what would run):**
```bash
act -n
```

**Verbose output:**
```bash
act -v
```

**Run with matrix strategy:**
```bash
act -j test --matrix node-version:22
```

#### Limitations

- Some actions may not work perfectly in local Docker environment
- Secrets need to be provided manually (use `.secrets` file)
- Some services (like GitHub API) may behave differently
- Large Docker images may take time to download initially

#### Troubleshooting

**Docker not running:**
```bash
# Start Docker Desktop, then retry
act -l
```

**Permission issues:**
```bash
# On Linux/Mac, ensure Docker permissions are correct
sudo usermod -aG docker $USER
```

**Workflow not found:**
```bash
# Specify the workflow file explicitly
act -W .github/workflows/ci.yml
```

**Node version mismatch:**
```bash
# Override Node version in environment
act --env NODE_VERSION=22
```

#### Example: Testing the Lint Step

```bash
# Run just the lint job from CI workflow
act -j lint

# Or run the entire quality-checks job
act -j quality-checks
```

#### Example: Testing Security Updates

```bash
# Test the security updates job
act -W .github/workflows/dependencies.yml -j security-updates

# With secrets
act -W .github/workflows/dependencies.yml -j security-updates --secret-file .secrets
```

#### VS Code Integration

For a better experience, consider using the [GitHub Local Actions extension](https://marketplace.visualstudio.com/items?itemName=SanjulaGanepola.github-local-actions) which provides a UI for running workflows directly in VS Code.

---

## Git Workflow

### Branch Strategy

#### Branch Naming
```bash
# Feature branches
feature/calculator-enhancements
feature/dark-mode-toggle
feature/investment-chart

# Bug fixes
bugfix/calculation-error
bugfix/mobile-layout

# Hotfixes
hotfix/security-patch
hotfix/critical-bug

# Chores
chore/update-dependencies
chore/refactor-utils
```

#### Commit Messages
```bash
# Conventional commits
feat: add dark mode toggle
fix: resolve calculation error for zero values
docs: update API documentation
style: format code with prettier
refactor: extract calculation utilities
test: add unit tests for calculator
chore: update dependencies

# With scope
feat(calculator): add investment growth chart
fix(chart): resolve rendering issue on mobile
docs(api): add component prop documentation
```

### Pull Request Process

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance impact considered
```

#### Code Review Guidelines
- **Functionality** - Does the code work as intended?
- **Readability** - Is the code easy to understand?
- **Performance** - Are there any performance implications?
- **Security** - Are there any security concerns?
- **Testing** - Is the code properly tested?

---

## Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Type errors
npm run type-check

# Fix common issues
npm run lint:fix
```

#### Build Failures
```bash
# Clear cache and rebuild
npm run build -- --reset-cache

# Check for dependency issues
npm audit
npm audit fix
```

#### Test Failures
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- --testPathPattern=Calculator.test.tsx

# Update snapshots
npm test -- --updateSnapshot
```

#### Performance Issues
```bash
# Analyze bundle
npm run bundle-analyzer

# Run Lighthouse
npm run lighthouse

# Check bundle size
npm run bundle-size
```

### Debug Commands

```bash
# Development server with debug info
DEBUG=* npm start

# Build with verbose output
npm run build -- --verbose

# Test with coverage
npm test -- --coverage --watchAll=false

# Lint with detailed output
npm run lint -- --debug
```

---

## Best Practices

### Code Organization

1. **Single Responsibility** - Each component should have one clear purpose
2. **Composition over Inheritance** - Use composition patterns
3. **DRY Principle** - Don't repeat yourself
4. **KISS Principle** - Keep it simple, stupid

### Performance

1. **Lazy Loading** - Load components and data when needed
2. **Memoization** - Use React.memo, useMemo, useCallback appropriately
3. **Bundle Splitting** - Split code into smaller chunks
4. **Image Optimization** - Use appropriate image formats and sizes

### Security

1. **Input Validation** - Validate all user inputs
2. **XSS Prevention** - Sanitize user-generated content
3. **CSRF Protection** - Use proper CSRF tokens
4. **Dependency Security** - Keep dependencies updated

### Accessibility

1. **Semantic HTML** - Use proper HTML elements
2. **ARIA Labels** - Add appropriate ARIA attributes
3. **Keyboard Navigation** - Ensure keyboard accessibility
4. **Color Contrast** - Maintain proper contrast ratios

---

## Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs)

### Tools
- [VS Code](https://code.visualstudio.com)
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

### Testing
- [Testing Library](https://testing-library.com)
- [Jest](https://jestjs.io)
- [Playwright](https://playwright.dev)

---

## Support

For development-related questions:

- 📧 **Email**: dev@lifesmart-calculator.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/lifesmart-calculator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/lifesmart-calculator/discussions)
- 📚 **Documentation**: [Full Documentation](https://docs.lifesmart-calculator.com)
