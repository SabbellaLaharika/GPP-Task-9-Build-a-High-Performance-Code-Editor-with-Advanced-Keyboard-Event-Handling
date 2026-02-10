import React, { useEffect, useRef } from 'react';

const Dashboard = ({ logs, onClear }) => {
    const listRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="dashboard-container" data-test-id="event-dashboard">
            <div className="dashboard-header">
                <h2>Event Debugger</h2>
                <button className="clear-btn" onClick={onClear}>Clear Logs</button>
            </div>
            <div
                className="event-log-list"
                data-test-id="event-log-list"
                ref={listRef}
            >
                {logs.map((log) => (
                    <div key={log.id} className="log-entry" data-test-id="event-log-entry">
                        <span className="log-type">{log.type}</span>
                        <span className="log-message">
                            {log.message || `${log.key} (code: ${log.code})`}
                        </span>
                    </div>
                ))}
                {logs.length === 0 && <div className="empty-state">Waiting for events...</div>}
            </div>
        </div>
    );
};

export default Dashboard;
