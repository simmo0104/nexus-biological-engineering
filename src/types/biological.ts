export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  opacity: number;
  phase: number;
  signalProgress: number;
  isNode: boolean;
}

export interface Connection {
  fromId: number;
  toId: number;
  signalProgress: number;
  signalActive: boolean;
  opacity: number;
}

export interface StructuralConnection {
  fromIdx: number; 
  toIdx: number;
  isMainVein: boolean; 
}

export type StructureType = 'leaf' | 'branch' | 'cell' | 'helix';

export interface TargetPosition {
  x: number;
  y: number;
  isNode: boolean;
  mutationGroup?: number;
}

export interface StructureDefinition {
  targets: TargetPosition[];
  connections: StructuralConnection[];
}

export interface BiologicalFormationProps {
  structure?: StructureType;
  width?: number;
  height?: number;
  className?: string;
}

export type AnimationPhase =
  | 'float'
  | 'organize'
  | 'form'
  | 'stabilize'
  | 'breathe'
  | 'mutate';
