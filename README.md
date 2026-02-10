# High-Performance Code Editor

A browser-based code editor built with React and Vite, featuring advanced keyboard event handling, Docker containerization, and a real-time event debugging dashboard.

## Features

- **Split View Interface**: Code editor and real-time event log dashboard.
- **Advanced Keyboard Handling**:
  - **Save**: `Ctrl+S` / `Cmd+S` (Custom action, prevents browser default).
  - **Undo/Redo**: `Ctrl+Z` / `Cmd+Z` and `Ctrl+Shift+Z` / `Cmd+Shift+Z` with history stack.
  - **Comment Toggle**: `Ctrl+/` / `Cmd+/` toggles line comments.
  - **Chorded Shortcuts**: `Ctrl+K` followed by `Ctrl+C` triggers a special action.
  - **Indentation**: `Tab` (2 spaces), `Shift+Tab` (outdent), and auto-indent on `Enter`.
- **Performance Optimizations**:
  - Debounced syntax highlighting logic (simulated).
  - Efficient event logging with history limits.
- **Dockerized**: specific `Dockerfile` and `docker-compose.yml` for consistent environments.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed.
- (Optional) Node.js 18+ for local development without Docker.

### Running with Docker (Recommended)
1. **Build and Start**:
   ```bash
   docker-compose up -d --build
   ```
2. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.
3. **Verify Health**:
   The container includes a healthcheck that curls localhost:3000.

### Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## Design Decisions

- **State Management**: Implemented a custom hook `useEditorState` to manage content and the undo/redo stack. This provides a clean separation of concerns from the UI components.
- **Event Handling**: Centralized `keydown` listener on the textarea to intercept shortcuts before browser defaults. This ensures consistent behavior across platforms (Mac/Windows).
- **Debouncing**: Used a custom debounce utility for the "expensive" syntax highlighting operation to prevent performance degradation during rapid typing.
- **CSS Architecture**: Used CSS variables for theming to allow easy switching between light/dark modes in the future, with a focus on a "dark mode first" aesthetic similar to VS Code.

## Verification

The application exposes internal state for automated testing:
- `window.getEditorState()`: Returns `{ content, historySize }`.
- `window.getHighlightCallCount()`: Returns the number of times the syntax highlighter ran.
