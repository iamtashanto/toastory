import React from 'react';
import { Toaster, useToast } from 'glazekit/react';
import { ui } from 'glazekit';
import 'glazekit/themes/ios-glass.toast.css';
import 'glazekit/themes/ios-glass.dialog.css';

export function App(): React.JSX.Element {
  const toast = useToast();

  const handlePromiseToast = async (): Promise<void> => {
    const uploadTask = new Promise<{ id: string }>((resolve) =>
      setTimeout(() => resolve({ id: 'file-123' }), 1200),
    );

    await toast
      .promise(uploadTask, {
        loading: 'Uploading document...',
        success: (data) => `Document uploaded (ID: ${data.id})`,
        error: 'Upload failed',
      })
      .unwrap();
  };

  const handleConfirm = async (): Promise<void> => {
    const result = await ui.confirm({
      title: 'Delete workspace?',
      text: 'This operation is permanent and cannot be reversed.',
      tone: 'danger',
      confirmButton: { label: 'Delete Permanently' },
      cancelButton: { label: 'Cancel' },
    });

    if (result.isConfirmed) {
      toast.success('Workspace deleted');
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>glazekit React Example</h1>
      <p>Seamless Apple glass feedback toolkit with reactive hooks.</p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
        <button
          type="button"
          onClick={() =>
            toast.success('Profile updated!', { description: 'Saved to cloud storage' })
          }
        >
          Success Toast
        </button>
        <button type="button" onClick={() => void handlePromiseToast()}>
          Promise Toast
        </button>
        <button type="button" onClick={() => void handleConfirm()}>
          Confirm Dialog
        </button>
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
