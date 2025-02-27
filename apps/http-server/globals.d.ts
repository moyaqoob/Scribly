// src/global.d.ts

// Extend the global scope for Node.js (if needed)
export {};

declare global {
  // Global variables or constants
  const MY_GLOBAL_API_KEY: string;
  const MY_GLOBAL_CONFIG: {
    apiUrl: string;
    timeout: number;
  };

  // Extend Express types for custom middleware or properties
  namespace Express {
    interface Request {
      userId?: {
        id: string;
        email: string;
        role: string;
      };
      customData?: any; // Add custom properties to the Request object
    }

    interface Response {
      customResponseData?: any; // Add custom properties to the Response object
    }

    interface Application {
      customMiddleware: (options?: any) => void;
    }
  }

  // Augment Node.js global types (e.g., process.env)
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }

  // Custom utility types or interfaces
  interface CustomGlobalInterface {
    name: string;
    value: number;
  }

  // Declare a global function (if needed)
  function myGlobalFunction(param: string): void;
}