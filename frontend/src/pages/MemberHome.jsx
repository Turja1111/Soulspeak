import React from 'react';
import Chat from './Chat';

// MemberHome: simple wrapper for an authenticated member dashboard.
const MemberHome = ({ user }) => {
  // Could show dashboard cards or stats here; for now render Chat dashboard.
  return <Chat />;
};

export default MemberHome;
