import React from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import EmailVerification from './EmailVerification';

const CodeVerificationDialog = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess
}) => {

  // Handle closing the dialog
  const handleClose = () => {
    // Call the parent onClose
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent 
        className="p-0 border-0 bg-transparent overflow-hidden sm:max-w-md"
      >
        {/* Hidden title for accessibility */}
        <VisuallyHidden>
          <DialogTitle>Vérification du code email</DialogTitle>
        </VisuallyHidden>
        
        {/* The EmailVerification component itself handles its internal steps */}
        <EmailVerification
          email={email}
          onVerificationSuccess={onVerificationSuccess}
          onCancel={handleClose} // Use handleClose as the cancel callback
          showSendEmailForm={false} // Always show the code input form
          showCloseButton={false} // Don't show the X button since the dialog has its own
        />
      </DialogContent>
    </Dialog>
  );
};

export default CodeVerificationDialog; 