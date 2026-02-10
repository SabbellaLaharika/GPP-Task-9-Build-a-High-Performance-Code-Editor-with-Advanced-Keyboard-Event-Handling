import React from 'react';

const Dashboard = () => {
    // Placeholder logs for visual verification
    const logs = [
        { id: 1, type: 'system', message: 'Dashboard initialized' },
    ];

    return (
        <div className="dashboard-container" data-test-id="event-dashboard">
            <div className="dashboard-header">
                <h2>Event Debugger</h2>
                <button className="clear-btn">Clear Logs</button>
            </div>
            <div className="event-log-list" data-test-id="event-log-list">
                {logs.map((log) => (
                    <div key={log.id} className="log-entry" data-test-id="event-log-entry">
                        <span className="log-type">{log.type}</span>
                        <span className="log-message">{log.message}</span>
                    </div>
                ))}
                {logs.length === 0 && <div className="empty-state">No events captured yet.</div>}
            </div>
        </div>
    );
};

export default Dashboard;
