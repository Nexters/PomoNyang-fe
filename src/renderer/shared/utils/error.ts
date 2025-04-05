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
