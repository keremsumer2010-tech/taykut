// Rota çözümünü ana iş parçacığının dışında yapar. Sonuç Float32Array'i kopyasız (transferable) döner.
// (DOM ve WebWorker tip kütüphaneleri aynı projede çakıştığı için `self` daraltılarak kullanılır.)
import { runRouteJob, type RouteJob } from './routeSolver';

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<RouteJob>) => void) | null;
  postMessage(message: unknown, transfer: Transferable[]): void;
};

ctx.onmessage = (e) => {
  const result = runRouteJob(e.data);
  ctx.postMessage(result, [result.data.buffer]);
};
