export interface Statistic {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export const statistics: Statistic[] = [
  {
    value: 48,
    suffix: '',
    label: 'Active nodes',
    description: 'Biological network nodes actively monitored',
  },
  {
    value: 127,
    suffix: '',
    label: 'Signal pathways',
    description: 'Mapped molecular communication routes',
  },
  {
    value: 3,
    suffix: '',
    label: 'Adaptive states',
    description: 'Distinct system equilibrium configurations',
  },
  {
    value: 98.4,
    suffix: '%',
    label: 'System response',
    description: 'Accuracy of biological signal prediction',
  },
];
