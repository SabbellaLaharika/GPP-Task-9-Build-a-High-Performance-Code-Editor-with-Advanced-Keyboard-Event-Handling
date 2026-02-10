import { useState, useCallback, useEffect } from 'react';

const useEditorState = (initialContent = '') => {
    const [content, setContent] = useState(initialContent);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    // Expose state for verification
    useEffect(() => {
        window.getEditorState = () => ({
            content,
            historySize: undoStack.length
        });
    }, [content, undoStack]);

    const update = useCallback((newContent) => {
        setUndoStack((prev) => [...prev, content]);
        setRedoStack([]);
        setContent(newContent);
    }, [content]);

    const undo = useCallback(() => {
        if (undoStack.length === 0) return;
        const previous = undoStack[undoStack.length - 1];
        setRedoStack((prev) => [...prev, content]);
        setUndoStack((prev) => prev.slice(0, -1));
        setContent(previous);
    }, [content, undoStack]);

    const redo = useCallback(() => {
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        setUndoStack((prev) => [...prev, content]);
        setRedoStack((prev) => prev.slice(0, -1));
        setContent(next);
    }, [content, redoStack]);

    return {
        content,
        update,
        undo,
        redo,
        setContent // Direct setter for internal use if needed without history
    };
};

export default useEditorState;
