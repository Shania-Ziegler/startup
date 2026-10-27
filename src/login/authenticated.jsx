import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CHAMBERS } from '../chamber/chambers';
import { loadProgress, levelsDone } from '../progress';

export function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();
  const [restored, setRestored] = React.useState(0);

  React.useEffect(() => {
    const progress = loadProgress();
    setRestored(
      CHAMBERS.filter((chamber) => levelsDone(progress, chamber.id) >= chamber.levels.length).length
    );
  }, []);

  return (
    <>
      <div className="auth-copy">
                <h2 id="login-title">Welcome back, {userName}.</h2>
        <p>
          {restored === 0
            ? 'No chambers complete yet. Start with the Quiet Chamber.'
            : `${restored} of ${CHAMBERS.length} chambers complete.`}
        </p>
      </div>

      <button type="button" className="primary-btn" onClick={() => navigate('/map')}>
        Go to the map
      </button>

      <p className="auth-switch">
        <button type="button" className="text-btn" onClick={onLogout}>Sign out</button>
      </p>
    </>
  );
}