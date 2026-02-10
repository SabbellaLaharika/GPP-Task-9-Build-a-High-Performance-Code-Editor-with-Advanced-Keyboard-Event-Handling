import React from 'react';
import Editor from './components/Editor';
import Dashboard from './components/Dashboard';

function App() {
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
          <Editor />
        </section>
        <section className="dashboard-pane">
          <Dashboard />
        </section>
      </main>
    </div>
  );
}

export default App;
