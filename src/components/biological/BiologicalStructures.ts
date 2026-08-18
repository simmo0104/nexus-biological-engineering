// SK 17/08/2026 - Defines the four biological structures used by NEXUS (leaf, branch, cell, and DNA helix) as normalized particle positions and connections, keeping the shape/geometry logic separate from the animation and canvas rendering.
import { StructureDefinition, TargetPosition, StructuralConnection } from '../../types/biological';

export function buildLeafStructure(): StructureDefinition {
  const targets: TargetPosition[] = [];
  const connections: StructuralConnection[] = [];

  const push = (x: number, y: number, isNode: boolean, group = 0): number => {
    targets.push({ x, y, isNode, mutationGroup: group });
    return targets.length - 1;
  };
  const connect = (a: number, b: number, isMainVein: boolean) => {
    connections.push({ fromIdx: a, toIdx: b, isMainVein });
  };

  const SPINE_COUNT = 10;
  const spineIds: number[] = [];
  for (let i = 0; i < SPINE_COUNT; i++) {
    const t = i / (SPINE_COUNT - 1);
    const curve = Math.sin(t * Math.PI) * 0.016; // subtle natural bow
    const id = push(0.5 + curve, 0.08 + t * 0.78, true, 0);
    spineIds.push(id);
    if (i > 0) connect(spineIds[i - 1], id, true);
  }

  const veinDefs: [number, number, number, number][] = [
    [8, 0.230, 0.645, 1],
    [7, 0.210, 0.565, 1],
    [6, 0.205, 0.495, 1],
    [5, 0.215, 0.425, 2],
    [4, 0.225, 0.360, 2],
    [3, 0.268, 0.295, 2],
    [2, 0.308, 0.232, 2],
  ];

  for (const [spineIdx, ltx, lty, mGroup] of veinDefs) {
    const junctionId = spineIds[spineIdx];
    const jX = targets[junctionId].x;
    const jY = targets[junctionId].y;

    const lMidId = push((jX + ltx) / 2, (jY + lty) / 2, false, mGroup);
    const lTipId = push(ltx, lty, true, mGroup);
    connect(junctionId, lMidId, false);
    connect(lMidId, lTipId, false);

    const rtx = 1.0 - ltx;
    const rMidId = push((jX + rtx) / 2, (jY + lty) / 2, false, mGroup);
    const rTipId = push(rtx, lty, true, mGroup);
    connect(junctionId, rMidId, false);
    connect(rMidId, rTipId, false);

    if (mGroup === 1) {
      const subL = push(ltx - 0.03, lty + 0.045, false, mGroup);
      connect(lMidId, subL, false);
      const subR = push(rtx + 0.03, lty + 0.045, false, mGroup);
      connect(rMidId, subR, false);
    }
  }

  const OUTLINE = 26;
  for (let i = 0; i <= OUTLINE; i++) {
    const t = i / OUTLINE;
    // sin curve peaked at t~0.45 (just below mid-leaf) for realistic leaf shape
    const w = Math.sin(t * Math.PI) * (1 + t * 0.12) * 0.275;
    const yPos = 0.08 + t * 0.78;
    if (w < 0.012) continue;
    push(0.5 + w, yPos, false, 3);
    push(0.5 - w, yPos, false, 3);
  }

  const baseId = spineIds[SPINE_COUNT - 1];
  const p1 = push(0.5, 0.89, false, 0);
  const p2 = push(0.5, 0.94, true, 0);
  connect(baseId, p1, true);
  connect(p1, p2, true);

  return { targets, connections };
}

export function buildBranchStructure(): StructureDefinition {
  const targets: TargetPosition[] = [];
  const connections: StructuralConnection[] = [];
  const push = (x: number, y: number, isNode: boolean, group = 0): number => {
    targets.push({ x, y, isNode, mutationGroup: group });
    return targets.length - 1;
  };
  const connect = (a: number, b: number, isMain: boolean) =>
    connections.push({ fromIdx: a, toIdx: b, isMainVein: isMain });

  const TRUNK = 7;
  const trunkIds: number[] = [];
  for (let i = 0; i < TRUNK; i++) {
    const t = i / (TRUNK - 1);
    const id = push(0.5, 0.88 - t * 0.55, i === 0 || i === TRUNK - 1, 0);
    trunkIds.push(id);
    if (i > 0) connect(trunkIds[i - 1], id, true);
  }

  const branchDefs: [number, number, number, number, number][] = [
    [5, 0.28, 0.40, 3, 1],
    [4, 0.22, 0.32, 3, 2],
    [3, 0.28, 0.24, 3, 2],
    [2, 0.34, 0.18, 3, 2],
  ];
  for (const [tIdx, lx, ly, segs, grp] of branchDefs) {
    const jId = trunkIds[tIdx];
    const rx = 1 - lx;
    let prevL = jId, prevR = jId;
    for (let s = 1; s <= segs; s++) {
      const t = s / segs;
      const lId = push(targets[jId].x + (lx - targets[jId].x) * t, targets[jId].y + (ly - targets[jId].y) * t, s === segs, grp);
      const rId = push(targets[jId].x + (rx - targets[jId].x) * t, targets[jId].y + (ly - targets[jId].y) * t, s === segs, grp);
      connect(prevL, lId, false); prevL = lId;
      connect(prevR, rId, false); prevR = rId;
    }
  }

  return { targets, connections };
}

export function buildCellStructure(): StructureDefinition {
  const targets: TargetPosition[] = [];
  const connections: StructuralConnection[] = [];
  const push = (x: number, y: number, isNode: boolean, group = 0): number => {
    targets.push({ x, y, isNode, mutationGroup: group });
    return targets.length - 1;
  };
  const connect = (a: number, b: number, isMain: boolean) =>
    connections.push({ fromIdx: a, toIdx: b, isMainVein: isMain });

  const OUTER = 24;
  const outerIds: number[] = [];
  for (let i = 0; i < OUTER; i++) {
    const angle = (i / OUTER) * Math.PI * 2;
    const r = 0.36 + Math.sin(i * 2.3) * 0.015;
    outerIds.push(push(0.5 + Math.cos(angle) * r, 0.5 + Math.sin(angle) * r * 0.9, i % 6 === 0, 3));
    if (i > 0) connect(outerIds[i - 1], outerIds[i], false);
  }
  connect(outerIds[OUTER - 1], outerIds[0], false);

  const NUC = 12;
  const nucIds: number[] = [];
  for (let i = 0; i < NUC; i++) {
    const angle = (i / NUC) * Math.PI * 2;
    nucIds.push(push(0.5 + Math.cos(angle) * 0.13, 0.5 + Math.sin(angle) * 0.13, i % 4 === 0, 0));
    if (i > 0) connect(nucIds[i - 1], nucIds[i], false);
  }
  connect(nucIds[NUC - 1], nucIds[0], false);
  const centreId = push(0.5, 0.5, true, 0);
  for (let i = 0; i < NUC; i += 4) connect(centreId, nucIds[i], true);

  const organellePos = [[0.64, 0.34], [0.37, 0.63], [0.67, 0.62], [0.35, 0.37]];
  for (const [ox, oy] of organellePos) {
    const orgIds: number[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      orgIds.push(push(ox + Math.cos(angle) * 0.055, oy + Math.sin(angle) * 0.038, i === 0, 1));
      if (i > 0) connect(orgIds[i - 1], orgIds[i], false);
    }
    connect(orgIds[5], orgIds[0], false);
  }

  return { targets, connections };
}

export function buildHelixStructure(): StructureDefinition {
  const targets: TargetPosition[] = [];
  const connections: StructuralConnection[] = [];
  const push = (x: number, y: number, isNode: boolean, group = 0): number => {
    targets.push({ x, y, isNode, mutationGroup: group });
    return targets.length - 1;
  };
  const connect = (a: number, b: number, isMain: boolean) =>
    connections.push({ fromIdx: a, toIdx: b, isMainVein: isMain });

  const turns = 3.5;
  const steps = 35;
  const strandA: number[] = [];
  const strandB: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const y = 0.10 + t * 0.80;
    const isNode = i % Math.round(steps / turns) === 0;
    strandA.push(push(0.5 + Math.cos(angle) * 0.20, y, isNode, 1));
    strandB.push(push(0.5 + Math.cos(angle + Math.PI) * 0.20, y, isNode, 1));
    if (i > 0) {
      connect(strandA[i - 1], strandA[i], true);
      connect(strandB[i - 1], strandB[i], true);
    }
    if (i % 5 === 0) connect(strandA[i], strandB[i], false);
  }

  return { targets, connections };
}

export function getStructureDefinition(structure: string): StructureDefinition {
  switch (structure) {
    case 'leaf':   return buildLeafStructure();
    case 'branch': return buildBranchStructure();
    case 'cell':   return buildCellStructure();
    case 'helix':  return buildHelixStructure();
    default:       return buildLeafStructure();
  }
}

// SK 17/08/2026 - Defines the four biological structures used by NEXUS (leaf, branch, cell, and DNA helix) as normalized particle positions and connections, keeping the shape/geometry logic separate from the animation and canvas rendering.