import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type UnsavedChangesWarningProps = {
  isFormDirty: boolean;
};

const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({ isFormDirty }) => {
  useBeforeUnload(isFormDirty); 
  return null;
};

export default UnsavedChangesWarning;

function useBeforeUnload(shouldWarn: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = ''; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldWarn]);
}


// import React, { useEffect } from 'react';

// interface UnsavedChangesWarningProps {
//   hasUnsavedChanges: boolean;
//   onConfirmLeave: () => void;
// }

// const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({
//   hasUnsavedChanges,
//   onConfirmLeave,
// }) => {
//   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
//     if (hasUnsavedChanges) {
//       const message = 'You have unsaved changes, are you sure you want to leave?';
//       event.returnValue = message;  // Standard for modern browsers
//       return message;  // For some browsers
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [hasUnsavedChanges]);

//   const handleGoBack = () => {
//     if (hasUnsavedChanges) {
//       const confirmGoBack = window.confirm('You have unsaved changes. Are you sure you want to go back?');
//       if (confirmGoBack) {
//         onConfirmLeave(); // Handle the navigation
//       }
//     } else {
//       onConfirmLeave(); // No unsaved changes, proceed with navigation
//     }
//   };

//   return (
//     <button onClick={handleGoBack} className="btn btn-warning">
//       Go Back
//     </button>
//   );
// };

// export default UnsavedChangesWarning;
