export type ErrorResponse = {
  type: string;
  message: string;
  errorTraceId: string;
};

export const isErrorResponse = (error: unknown): error is ErrorResponse => {
  if (typeof error !== 'object' || error == null) {
    return false;
  }
  return 'type' in error && 'message' in error && 'errorTraceId' in error;
};

export const createErrorResponse = (message: string): ErrorResponse => {
  return {
    type: 'error',
    message,
    errorTraceId: 'mock-trace-id',
  };
};
