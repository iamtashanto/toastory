import type { DocArticle } from './docs-data';

export const RECIPES_ARTICLES: Record<string, DocArticle> = {
  // 1. FORM SUBMIT FEEDBACK
  'recipes/form-submission': {
    slug: 'recipes/form-submission',
    title: 'Form Submission with Promise Feedback',
    description: 'Provide clear asynchronous status feedback during form validation, serialization, and network dispatch.',
    category: 'Recipes',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Pattern Overview' },
      { id: 'implementation', title: 'Complete React / Next.js Implementation' },
    ],
    content: `
# Form Submission with Promise Feedback

Combine form submission states with \`toast.promise()\` to give users immediate visual assurance during database mutations.

\`\`\`tsx
import React, { useState } from 'react';
import { toast } from 'toastory';

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSubmitting(true);

    try {
      await toast.promise(
        fetch('/api/contact', { method: 'POST', body: formData }).then((r) => {
          if (!r.ok) throw new Error('Submission failed');
          return r.json();
        }),
        {
          loading: 'Sending message...',
          success: 'Message delivered! We will reply within 24 hours.',
          error: (err) => \`Failed: \${(err as Error).message}\`,
          description: 'Secure TLS dispatch to customer support.',
        }
      ).unwrap();
      e.currentTarget.reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input name="email" type="email" required placeholder="Your email" className="w-full p-2 rounded border" />
      <textarea name="message" required placeholder="Your message" className="w-full p-2 rounded border" />
      <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
\`\`\`
`,
  },

  // 2. OPTIMISTIC UI WITH UNDO
  'recipes/optimistic-undo': {
    slug: 'recipes/optimistic-undo',
    title: 'Optimistic UI with 5-Second Undo Grace Period',
    description: 'Instantly update the user interface and provide a 5-second undo grace period before firing the remote mutation.',
    category: 'Recipes',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Pattern Overview' },
      { id: 'implementation', title: 'Implementation with toastory Action' },
    ],
    content: `
# Optimistic UI with 5-Second Undo Grace Period

When deleting items, archive records immediately in local state and give the user 5 seconds to undo before dispatching the destructive API call.

\`\`\`typescript
import { toast } from 'toastory';

export function deleteEmailOptimistic(emailId: string) {
  let isCancelled = false;

  // 1. Remove from local UI immediately (optimistic update)
  removeEmailFromList(emailId);

  // 2. Schedule server deletion after 5 seconds
  const timer = setTimeout(async () => {
    if (!isCancelled) {
      await api.deleteEmailPermanently(emailId);
    }
  }, 5000);

  // 3. Show undo toast with progress countdown
  toast('Conversation moved to Trash', {
    duration: 5000,
    progress: true,
    action: {
      label: 'Undo',
      onClick: () => {
        isCancelled = true;
        clearTimeout(timer);
        restoreEmailToList(emailId);
        toast.info('Deletion undone.');
      },
    },
  });
}
\`\`\`
`,
  },

  // 3. FILE UPLOAD PROGRESS
  'recipes/file-upload': {
    slug: 'recipes/file-upload',
    title: 'File Upload Progress Tracker',
    description: 'Track multi-megabyte file uploads with live percent counters and in-place toast mutations.',
    category: 'Recipes',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Pattern Overview' },
      { id: 'implementation', title: 'XMLHttpRequest Progress Tracking' },
    ],
    content: `
# File Upload Progress Tracker

Use \`toast.loading()\` and \`toast.update()\` to display live percent uploads.

\`\`\`typescript
import { toast } from 'toastory';

export function uploadFileWithProgress(file: File) {
  const toastId = toast.loading(\`Uploading \${file.name}...\`, { duration: 0 });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload');

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      toast.update(toastId, {
        title: \`Uploading \${file.name} (\${percent}%)\`,
        description: \`\${(event.loaded / 1048576).toFixed(1)} MB of \${(event.total / 1048576).toFixed(1)} MB\`,
      });
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      toast.update(toastId, {
        type: 'success',
        title: 'Upload complete!',
        description: \`\${file.name} has been processed.\`,
        duration: 4000,
      });
    } else {
      toast.update(toastId, {
        type: 'error',
        title: 'Upload failed',
        description: 'Server returned error ' + xhr.status,
        duration: 5000,
      });
    }
  };

  const formData = new FormData();
  formData.append('file', file);
  xhr.send(formData);
}
\`\`\`
`,
  },

  // 4. DESTRUCTIVE DELETE GUARD
  'recipes/delete-type-to-confirm': {
    slug: 'recipes/delete-type-to-confirm',
    title: 'Destructive Delete Guard (Type to Confirm)',
    description: 'Protect critical resources by requiring the user to type the exact name before confirmation unlocks.',
    category: 'Recipes',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Why Type-to-Confirm?' },
      { id: 'implementation', title: 'ui.prompt() Implementation' },
    ],
    content: `
# Destructive Delete Guard (Type to Confirm)

For critical cloud infrastructure or project deletions, require the user to explicitly type the project slug to unlock the confirm button.

\`\`\`typescript
import { ui, toast } from 'toastory';

export async function promptDeleteProject(projectName: string) {
  const res = await ui.prompt({
    title: \`Delete "\${projectName}"?\`,
    text: \`This action cannot be undone. Please type "\${projectName}" to confirm:\`,
    input: 'text',
    placeholder: projectName,
    tone: 'danger',
    validate: (val) => {
      if (val !== projectName) {
        return \`Value does not match "\${projectName}".\`;
      }
      return undefined; // valid
    },
    preConfirm: async () => {
      await api.deleteProject(projectName);
    },
  });

  if (res.isConfirmed) {
    toast.error(\`Project \${projectName} deleted permanently.\`);
  }
}
\`\`\`
`,
  },

  // 5. SESSION TIMEOUT
  'recipes/session-timeout': {
    slug: 'recipes/session-timeout',
    title: 'Session Inactivity Timeout with Countdown',
    description: 'Display an accessible warning modal with a ticking countdown timer and extend session action.',
    category: 'Recipes',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Pattern Overview' },
      { id: 'implementation', title: 'ui.confirm() with timer Implementation' },
    ],
    content: `
# Session Inactivity Timeout with Countdown

Display an accessible session expiration modal with a live countdown bar and one-click session renewal.

\`\`\`typescript
import { ui, toast } from 'toastory';

export async function promptSessionTimeout(logoutCallback: () => void) {
  const res = await ui.confirm({
    title: 'Session Expiring Soon',
    text: 'You have been inactive. For your security, you will be logged out in 30 seconds.',
    tone: 'warning',
    timer: 30000,
    timerProgressBar: true,
    confirmButton: { label: 'Keep Me Logged In' },
    cancelButton: { label: 'Log Out Now' },
  });

  if (res.isConfirmed) {
    await renewAuthToken();
    toast.success('Session extended successfully.');
  } else {
    logoutCallback();
  }
}
\`\`\`
`,
  },

  // 6. OTP VERIFICATION
  'recipes/otp-verification': {
    slug: 'recipes/otp-verification',
    title: '6-Box Discrete OTP Code Verification',
    description: 'Authenticate two-factor challenges using prompt inputs with auto-advance and numeric masks.',
    category: 'Recipes',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Pattern Overview' },
      { id: 'implementation', title: 'Prompt Implementation' },
    ],
    content: `
# 6-Box Discrete OTP Code Verification

\`ui.prompt()\` supports formatted numeric codes with validation and async verification.

\`\`\`typescript
import { ui, toast } from 'toastory';

export async function promptTwoFactorCode(userPhone: string) {
  const res = await ui.prompt({
    title: 'Two-Factor Authentication',
    text: \`Enter the 6-digit security code sent to \${userPhone}:\`,
    input: 'number',
    placeholder: '123456',
    validate: (val) => {
      if (!val || String(val).length !== 6) {
        return 'Please enter a valid 6-digit verification code.';
      }
      return undefined;
    },
    preConfirm: async (val) => {
      const isValid = await api.verify2FA(String(val));
      if (!isValid) throw new Error('Incorrect security code. Please check your SMS and try again.');
    },
  });

  if (res.isConfirmed) {
    toast.success('Two-factor authentication verified.');
  }
}
\`\`\`
`,
  },
};
