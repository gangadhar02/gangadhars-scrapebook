
export interface StickyNote {
  id: string;
  message: string;
  color: string;
  authorName?: string;
  position: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
  rotation: number; // degrees
  createdAt: Date;
}

export const STICKY_NOTE_COLORS = [
  '#fff59c', // yellow
  '#f8bbd9', // pink
  '#a3d5ff', // blue
  '#b8e6b8', // green
  '#ffcc99', // orange
  '#d7b3ff', // purple
];

export const getRandomColor = () => {
  return STICKY_NOTE_COLORS[Math.floor(Math.random() * STICKY_NOTE_COLORS.length)];
};
