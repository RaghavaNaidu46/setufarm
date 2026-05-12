import React from 'react';
import { Link } from 'react-router-dom';

const RoleSelectionScreen = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>select your role</h2>
      <p>how do you want to use setufarm?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/farmer">i am a farmer</Link>
        <Link to="/buyer">i am a buyer</Link>
        <Link to="/driver">i am a driver</Link>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
