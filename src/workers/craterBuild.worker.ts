// Ana sayfa sahnesinin ağır verisini (arazi, renk, normaller, rover poz izi) ana iş parçacığının dışında üretir.
// Sonuç tamponları kopyasız (transferable) döner.
import { buildScene } from '@/scene/crater/build';
import type { Dem } from '@/scene/crater/terrain';

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<Dem>) => void) | null;
  postMessage(message: unknown, transfer: Transferable[]): void;
};

ctx.onmessage = (e) => {
  const d = buildScene(e.data);
  const grids = [d.big, d.patch];
  ctx.postMessage(d, [
    ...grids.flatMap((g) => [g.y.buffer, g.position.buffer, g.normal.buffer, g.color.buffer, g.index.buffer]),
    d.patch.uv!.buffer,
    d.rockBaseZ.buffer,
    d.track.data.buffer,
  ]);
};
