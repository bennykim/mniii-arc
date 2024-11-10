import { setupWorker } from 'msw/browser';

import { initializeHandlers } from '@/mocks/handlers';

export async function startMSW() {
  try {
    const handlers = await initializeHandlers();
    const worker = setupWorker(...handlers);
    await worker.start();
    console.log('MSW started successfully');
  } catch (error) {
    console.error('Failed to start MSW:', error);
  }
}
