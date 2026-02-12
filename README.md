# High-Performance Code Editor

A browser-based code editor built with React and Vite, designed to handle advanced keyboard events, real-time syntax highlighting, and robust state management. This project demonstrates high-performance patterns like debouncing, memoization, and efficient DOM manipulation, fully containerized with Docker.

## Features

- **Advanced Code Editor**:
  - **Syntax Highlighting**: Real-time highlighting for JavaScript, C++, Java, Python, Go, and Rust.
  - **Theming**: Seamless toggle between Dark (default) and Light themes.
  - **Overlay Architecture**: Performance-optimized dual-layer rendering for smooth typing and scrolling without input lag.
- **Keyboard Shortcuts**:
  - **Save**: `Ctrl+S` / `Cmd+S` (Intercepted custom action).
  - **Undo/Redo**: `Ctrl+Z` / `Cmd+Z` and `Ctrl+Shift+Z` / `Cmd+Shift+Z` with history stack.
  - **Comment Toggle**: `Ctrl+/` / `Cmd+/` toggles line comments.
  - **Chorded Shortcuts**: `Ctrl+K` followed by `Ctrl+C` triggers a special action.
  - **Indentation**: `Tab` (2 spaces), `Shift+Tab` (outdent), and auto-indent on `Enter`.
- **Performance Optimizations**:
  - **Debounced Highlighting**: Syntax highlighting calculation is debounced (200ms) to ensure responsiveness.
  - **Memoization**: `useMemo` and `useCallback` used extensively to minimize re-renders.
  - **Virtualization**: Efficient event logging with history limits.
- **Dockerized**: specific `Dockerfile` and `docker-compose.yml` for consistent environments.

---

## Setup Instructions

### Prerequisites
- **Docker** and **Docker Compose** installed.
- (Optional) **Node.js 18+** for local development without Docker.

### Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Adjust the `APP_PORT` in `.env` if port 3000 is occupied (default: 3000).

---

## Running the Application

### Option 1: Running with Docker (Recommended)
This uses a multi-stage production build (Nginx), ensuring a small image size (<25M) and high performance.
**Note**: Hot reloading is disabled in this mode. Rebuild to see changes.

1. **Build and Start**:
   ```bash
   docker-compose up -d --build
   ```
2. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.
3. **Verify Health**:
   The container includes a healthcheck that verified the server is running. You can check the status with:
   ```bash
   docker ps
   ```
   Look for the `(healthy)` status next to the container.
4. **Stop the Application**:
   ```bash
   docker-compose down
   ```

### Option 2: Running Locally
Useful for rapid development and debugging.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Run Linter**:
   To check for code quality issues:
   ```bash
   npm run lint
   ```

---

## Testing & Verification

### Manual Verification Steps
1.  **Typing & Syntax Highlighting**:
    -   Type `const x = "hello";` in the editor.
    -   Verify that keywords (`const`) are colored differently from strings (`"hello"`).
2.  **Shortcuts**:
    -   Press `Ctrl+S` (or `Cmd+S`) and check the Event Debugger for "Action: Save".
    -   Type a word, then press `Ctrl+Z` to undo and `Ctrl+Shift+Z` to redo.
3.  **Theming**:
    -   Click the Theme Toggle button in the header. Verify the editor and UI switch between light and dark modes smoothly.

### Automated Verification via Console
The application exposes internal state to the `window` object for automated testing and verification. Open your browser's developer console (F12) to use these:

| Function | Description | Example Output |
| :--- | :--- | :--- |
| `window.getEditorState()` | Returns current content and history stack size. | `{ content: "...", historySize: 5 }` |
| `window.getHighlightCallCount()` | Returns the number of times the syntax highlighter ran. | `15` |
| `window.changeTheme(theme)` | Programmatically switches the theme. | `undefined` (UI updates) |

**Example Verification Routine:**
```javascript
// Check initial state
console.log(window.getEditorState());

// Simulate typing (programmatically updating state is only via internal hooks, so type manually)

// Check if highlighting was debounced (count should be low even after rapid typing)
console.log(window.getHighlightCallCount());
```

---

## Troubleshooting

### Common Issues

**1. "Port 3000 is already in use"**
-   **Fix**: Open `.env` and change `APP_PORT` to a different value (e.g., `3001`).
-   Update `docker-compose.yml` ports mapping if necessary (e.g., `"3001:3000"`).

**2. "Container ID not found" or Container exits immediately**
-   **Cause**: The application might be failing to start inside the container.
-   **Fix**: Check logs with `docker-compose logs app`.
-   Ensure `npm install` succeeded during the build.

**3. Styles or Highlighting not appearing**
-   **Fix**: Ensure your browser supports CSS variables (modern browsers only).
-   Hard refresh the page (`Ctrl+F5`) to clear any cached CSS.

**4. Linting Errors**
-   If `npm run lint` fails, it may benefit from fixing stylistic issues. The project uses standard ESLint rules for React.

---

## Architecture

-   **State Management**: Custom `useEditorState` hook handles complex undo/redo logic without external libraries.
-   **Event System**: A centralized `keydown` listener on the input element ensures we capture events before the browser defaults (like `Ctrl+S`), providing a native-app-like experience.
-   **Component Structure**:
    -   `App.jsx`: Main layout and theme context.
    -   `Editor.jsx`: Core editor logic, highlighting, and input handling.
    -   `Dashboard.jsx`: Displays the real-time event log.
    -   `tokenizer.js`: Efficient regex-based tokenization for syntax highlighting.
