import React, { useState } from 'react';

const Editor = () => {
  const [content, setContent] = useState('// Welcome to the High-Performance Code Editor\n// Start typing...');
  const lineCount = content.split('\n').length;

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
        className="editor-input"
        data-test-id="editor-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};

export default Editor;
