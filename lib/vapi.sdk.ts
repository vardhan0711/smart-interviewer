import Vapi from '@vapi-ai/web';

// Check if we're in the browser environment
const isClient = typeof window !== 'undefined';

// Only initialize VAPI on the client side
export const vapi = isClient && process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN 
  ? new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN)
  : null;