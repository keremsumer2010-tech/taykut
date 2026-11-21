// Rota çözümünün saf çekirdeği: hem Web Worker'da hem (worker yoksa / testlerde) ana iş parçacığında çalışır.
import { Heightfield } from '@/lib/heightfield';
import type { RoverGeometry } from '@/scene/rover/geometry';
import { packTrack, type PoseTrack } from '@/scene/rover/poseTrack';
import { sampleRoute, solveRoute, type Point2 } from '@/scene/rover/route';

export interface RouteJob {
  geometry: RoverGeometry;
  heights: Float32Array;
  cols: number;
  rows: number;
  sizeX: number;
  sizeY: number;
  points: Point2[];
  samples: number;
}

export interface RouteResult extends PoseTrack {
  ms: number;
  maxResidual: number;
}

export function runRouteJob(job: RouteJob): RouteResult {
  const t0 = performance.now();
  const hf = new Heightfield(job.heights, job.cols, job.rows, job.sizeX, job.sizeY);
  const samples = sampleRoute(job.points, job.samples);
  const poses = solveRoute(job.geometry, hf, samples);
  const track = packTrack(job.geometry, samples, poses);
  return { ...track, ms: performance.now() - t0, maxResidual: Math.max(...poses.map((p) => p.residual)) };
}
