import React, { useState, useCallback } from 'react';
import Editor from './components/Editor';
import Dashboard from './components/Dashboard';

function App() {
  const [logs, setLogs] = useState([]);

  const logEvent = useCallback((eventData) => {
    setLogs((prevLogs) => [
      // Keep only last 50 logs to prevent performance issues
      ...prevLogs.slice(-49),
      { id: Date.now() + Math.random(), ...eventData }
    ]);
  }, []);

  const clearLogs = () => setLogs([]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>JS KeyLogger / Editor</h1>
        <div className="header-controls">
          <span className="badge">v1.0.0</span>
        </div>
      </header>
      <main className="main-layout">
        <section className="editor-pane">
          <Editor logEvent={logEvent} />
        </section>
        <section className="dashboard-pane">
          <Dashboard logs={logs} onClear={clearLogs} />
        </section>
      </main>
    </div>
  );
}

export default App;
