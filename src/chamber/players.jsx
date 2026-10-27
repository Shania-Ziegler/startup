import React from 'react';

import { ChamberNotifier } from './chamberNotifier';
import { useUser } from '../user';

export function Players() {
  const { userName } = useUser();
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    function handleEvent(event) {
      setEvents((previous) => [event, ...previous].slice(0, 6));
    }

    ChamberNotifier.addHandler(handleEvent);
    return () => ChamberNotifier.removeHandler(handleEvent);
  }, []);

  return (
    <aside className="together" aria-labelledby="players-title">
      <h3 id="players-title">Players</h3>

      <ul className="inline-list players" aria-label="Players online">
        <li>{userName || 'You'}</li>
        <li>Bob</li>
      </ul>

      <p className="hint-label" id="activity-label">Recent activity</p>

      <ul className="feed" aria-labelledby="activity-label" aria-live="polite">
        {events.length === 0 ? (
          <li>No activity yet.</li>
        ) : (
          events.map((event, index) => (
            <li key={`${event.at}-${index}`}>
              {event.name} {event.action}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}