import React, { useState, useRef, useEffect, useCallback } from 'react';
import useEditorState from '../hooks/useEditorState';

// Debounce Utility (Simple implementation)
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Global counter for verification
window.highlightCallCount = 0;
window.getHighlightCallCount = () => window.highlightCallCount;

const Editor = ({ logEvent }) => {
  const { content, update, undo, redo } = useEditorState('// Welcome to the High-Performance Code Editor\n// Start typing...');
  const [chordState, setChordState] = useState({ active: false, timestamp: 0 });
  const textareaRef = useRef(null);

  const lineCount = content.split('\n').length;

  // Simulate expensive syntax highlighting
  const performHighlight = () => {
    // This is where actual syntax highlighting would happen.
    // We just increment the counter for verification.
    window.highlightCallCount++;
    console.log('Highlighting performed. Count:', window.highlightCallCount);
  };

  // Debounce the highlight function (150ms minimum as per requirements)
  // We use useMemo/useCallback to ensure the debounced function is stable across renders
  const debouncedHighlight = useCallback(debounce(performHighlight, 200), []);

  // Trigger highlight on content change
  useEffect(() => {
    debouncedHighlight(content);
  }, [content, debouncedHighlight]);


  // Event Handlers
  const handleEvent = (e) => {
    // Basic logging for all targeted events
    let message = `${e.type}`;
    if (e.key) message += `: ${e.key}`;
    if (e.data) message += ` data: ${e.data}`;

    logEvent({
      type: e.type,
      key: e.key,
      code: e.code,
      message: message
    });
  };

  const handleKeyDown = (e) => {
    handleEvent(e); // Log keydown

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isModifier = isMac ? e.metaKey : e.ctrlKey;

    // 1. Save
    if (isModifier && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      logEvent({ type: 'action', message: 'Action: Save' });
      return;
    }

    // 2. Undo/Redo
    if (isModifier && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
      return;
    }

    // 3. Comment Toggle
    if (isModifier && e.key === '/') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const lines = content.split('\n');
      let startLineIndex = content.substring(0, start).split('\n').length - 1;
      let endLineIndex = content.substring(0, end).split('\n').length - 1;

      const newLines = [...lines];
      let modificationHappened = false;

      for (let i = startLineIndex; i <= endLineIndex; i++) {
        if (newLines[i].startsWith('// ')) {
          newLines[i] = newLines[i].substring(3);
        } else {
          newLines[i] = '// ' + newLines[i];
        }
        modificationHappened = true;
      }

      if (modificationHappened) {
        update(newLines.join('\n'));
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = end;
        }, 0);
      }
      return;
    }

    // 4. Chorded Shortcut
    if (isModifier && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      setChordState({ active: true, timestamp: Date.now() });
      return;
    }

    if (chordState.active) {
      const timeDiff = Date.now() - chordState.timestamp;
      if (timeDiff <= 2000) {
        if (isModifier && (e.key === 'c' || e.key === 'C')) {
          e.preventDefault();
          logEvent({ type: 'action', message: 'Action: Chord Success' });
          setChordState({ active: false, timestamp: 0 });
          return;
        }
      } else {
        setChordState({ active: false, timestamp: 0 });
      }
    }
    if (chordState.active && !(isModifier && (e.key === 'k' || e.key === 'K'))) {
      setChordState({ active: false, timestamp: 0 });
    }

    // 5. Tab / Shift+Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const lines = content.split('\n');
      let startLineIndex = content.substring(0, start).split('\n').length - 1;

      if (e.shiftKey) {
        const line = lines[startLineIndex];
        // "remove two spaces from the beginning of the current line, if present."
        // Checking '  ' first covers 2 spaces. Checking ' ' covers 1 space.
        if (line.startsWith('  ')) {
          lines[startLineIndex] = line.substring(2);
          update(lines.join('\n'));
          setTimeout(() => {
            textarea.selectionStart = Math.max(0, start - 2);
            textarea.selectionEnd = Math.max(0, end - 2);
          }, 0);
        } else if (line.startsWith(' ')) {
          lines[startLineIndex] = line.substring(1);
          update(lines.join('\n'));
          setTimeout(() => {
            textarea.selectionStart = Math.max(0, start - 1);
            textarea.selectionEnd = Math.max(0, end - 1);
          }, 0);
        }
      } else {
        // "insert two spaces at the beginning of the current line"
        const line = lines[startLineIndex];
        lines[startLineIndex] = '  ' + line;
        update(lines.join('\n'));
        setTimeout(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = end + 2;
        }, 0);
      }
      return;
    }

    // 6. Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;

      const currentLine = content.substring(0, start).split('\n').pop();
      const indentMatch = currentLine.match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : '';

      const newContent = content.substring(0, start) + '\n' + indent + content.substring(textarea.selectionEnd);
      update(newContent);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
      }, 0);
      return;
    }
  };

  const handleChange = (e) => {
    handleEvent(e); // Log input (React onChange is roughly input)
    update(e.target.value);
  };


  return (
    <div
      className="editor-container"
      data-test-id="editor-container"
    >
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="line-number">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className="editor-input"
        data-test-id="editor-input"
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleEvent}
        onInput={handleEvent} // React's onInput fires on input
        onCompositionStart={handleEvent}
        onCompositionUpdate={handleEvent}
        onCompositionEnd={handleEvent}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default Editor;
