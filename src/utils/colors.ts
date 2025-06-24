export const USER_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#84cc16', // lime
];

export const getRandomColor = (): string => {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
};

export const getUserColorClass = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    '#ef4444': 'border-red-500 bg-red-100 text-red-700',
    '#f97316': 'border-orange-500 bg-orange-100 text-orange-700',
    '#eab308': 'border-yellow-500 bg-yellow-100 text-yellow-700',
    '#22c55e': 'border-green-500 bg-green-100 text-green-700',
    '#06b6d4': 'border-cyan-500 bg-cyan-100 text-cyan-700',
    '#3b82f6': 'border-blue-500 bg-blue-100 text-blue-700',
    '#8b5cf6': 'border-violet-500 bg-violet-100 text-violet-700',
    '#ec4899': 'border-pink-500 bg-pink-100 text-pink-700',
    '#10b981': 'border-emerald-500 bg-emerald-100 text-emerald-700',
    '#f59e0b': 'border-amber-500 bg-amber-100 text-amber-700',
    '#6366f1': 'border-indigo-500 bg-indigo-100 text-indigo-700',
    '#84cc16': 'border-lime-500 bg-lime-100 text-lime-700',
  };
  return colorMap[color] || 'border-gray-500 bg-gray-100 text-gray-700';
};