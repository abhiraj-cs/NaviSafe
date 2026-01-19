'use client';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    // Note: In a real app, you would fetch the current user's auth state
    // to provide a full context for debugging security rules.
    const deniedMessage = `Firestore Security Rules denied the following request:\n${JSON.stringify(
      {
        path: context.path,
        operation: context.operation,
        // In a real app, you'd want to include the user's auth UID and claims here.
        auth: "Not available in this context.", 
        requestData: context.requestResourceData,
      },
      null,
      2
    )}`;

    super(
      `FirestoreError: Missing or insufficient permissions: ${deniedMessage}`
    );
    this.name = 'FirestorePermissionError';
    this.context = context;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }
}
