import React, { useEffect } from 'react';

const UnsavedChangesWarning = ({ isFormDirty }) => {
  useBeforeUnload(isFormDirty);
  return null;
};

export default UnsavedChangesWarning;

function useBeforeUnload(shouldWarn) {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = ''; // For modern browsers
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldWarn]);
}
