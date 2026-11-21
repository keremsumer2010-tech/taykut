// Bölge yüklenince rota pozlarını Web Worker'da çözer; worker yoksa ana iş parçacığında çözer.
import { runRouteJob, type RouteJob, type RouteResult } from '@/workers/routeSolver';

export function solveRouteAsync(job: RouteJob): Promise<RouteResult> {
  if (typeof Worker === 'undefined') return Promise.resolve(runRouteJob(job));
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../workers/routeSolver.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (e: MessageEvent<RouteResult>) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };
    // Yükseklik verisinin kopyası gönderilir (ana iş parçacığı kendi kopyasını arazi için tutar).
    worker.postMessage({ ...job, heights: job.heights.slice() });
  });
}
