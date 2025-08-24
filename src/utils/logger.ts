// A simple logger utility to standardize console output.

const getTimestamp = (): string => new Date().toISOString();

const logger = {
  info: (message: string, context?: object) => {
    console.log(`[${getTimestamp()}] INFO: ${message}`, context || '');
  },

  warn: (message: string, context?: object) => {
    console.warn(`[${getTimestamp()}] WARN: ${message}`, context || '');
  },

  error: (message: string, context?: { error?: any, [key: string]: any }) => {
    console.error(`[${getTimestamp()}] ERROR: ${message}`, context || '');
    if (context?.error instanceof Error) {
        console.error(context.error.stack);
    }
  },
};

export default logger;