export interface Capability {
  index: string;
  title: string;
  description: string;
  tag: string;
}

export const capabilities: Capability[] = [
  {
    index: '01',
    title: 'Cellular Discovery',
    description:
      'Exploring adaptive pathways at the single-cell level, mapping the molecular logic that drives biological decisions and disease states.',
    tag: 'Single-cell resolution',
  },
  {
    index: '02',
    title: 'Biological Computation',
    description:
      'Signals that process and respond to environmental cues — encoding logic into living systems that calculate, remember, and adapt.',
    tag: 'Signal processing',
  },
  {
    index: '03',
    title: 'Synthetic Systems',
    description:
      'Engineered organisms with programmable behavior. We design genetic circuits that perform precise functions within complex biological environments.',
    tag: 'Genetic engineering',
  },
  {
    index: '04',
    title: 'Therapeutic Design',
    description:
      'Precision interventions guided by biological logic. Treatments shaped by the systems-level understanding of how life responds to disruption.',
    tag: 'Precision medicine',
  },
];
