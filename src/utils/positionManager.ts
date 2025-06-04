
export interface Position {
  x: number;
  y: number;
}

export interface NotePosition extends Position {
  rotation: number;
}

export interface StickyNoteType {
  id: string;
  message: string;
  color: string;
  authorName?: string;
  position: Position;
  rotation: number;
  createdAt: Date;
}

const NOTE_WIDTH = 192; // 48 * 4 (w-48 in pixels)
const NOTE_HEIGHT = 192; // 48 * 4 (h-48 in pixels)
const MIN_SPACING = 20; // Minimum space between notes
const VIEWPORT_PADDING = 50; // Padding from viewport edges

export const checkCollision = (
  newPos: Position,
  existingPositions: Position[],
  noteWidth = NOTE_WIDTH,
  noteHeight = NOTE_HEIGHT,
  spacing = MIN_SPACING
): boolean => {
  for (const pos of existingPositions) {
    const deltaX = Math.abs(newPos.x - pos.x);
    const deltaY = Math.abs(newPos.y - pos.y);
    
    if (deltaX < (noteWidth + spacing) && deltaY < (noteHeight + spacing)) {
      return true; // Collision detected
    }
  }
  return false;
};

export const findAvailablePosition = (
  existingPositions: Position[],
  containerWidth: number,
  containerHeight: number
): Position => {
  const maxAttempts = 100;
  let attempts = 0;
  
  // Calculate usable area (accounting for note size and padding)
  const usableWidth = containerWidth - NOTE_WIDTH - (VIEWPORT_PADDING * 2);
  const usableHeight = containerHeight - NOTE_HEIGHT - (VIEWPORT_PADDING * 2);
  
  while (attempts < maxAttempts) {
    const x = VIEWPORT_PADDING + Math.random() * usableWidth;
    const y = VIEWPORT_PADDING + Math.random() * usableHeight;
    
    const newPosition = { x, y };
    
    if (!checkCollision(newPosition, existingPositions)) {
      return newPosition;
    }
    
    attempts++;
  }
  
  // If we couldn't find a random position, use a grid-based fallback
  return findGridPosition(existingPositions, containerWidth);
};

const findGridPosition = (
  existingPositions: Position[],
  containerWidth: number
): Position => {
  const cols = Math.floor((containerWidth - VIEWPORT_PADDING * 2) / (NOTE_WIDTH + MIN_SPACING));
  const startX = VIEWPORT_PADDING;
  const startY = VIEWPORT_PADDING;
  
  let row = 0;
  let col = 0;
  
  while (true) {
    const x = startX + col * (NOTE_WIDTH + MIN_SPACING);
    const y = startY + row * (NOTE_HEIGHT + MIN_SPACING);
    
    const gridPosition = { x, y };
    
    if (!checkCollision(gridPosition, existingPositions)) {
      return gridPosition;
    }
    
    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
  }
};

export const calculateRequiredHeight = (positions: Position[]): number => {
  if (positions.length === 0) return window.innerHeight;
  
  const maxY = Math.max(...positions.map(pos => pos.y));
  const requiredHeight = maxY + NOTE_HEIGHT + VIEWPORT_PADDING;
  
  return Math.max(requiredHeight, window.innerHeight);
};

// Convert pixel positions to percentage for CSS
export const positionToPercentage = (
  pixelPos: Position,
  containerWidth: number,
  containerHeight: number
): Position => ({
  x: (pixelPos.x / containerWidth) * 100,
  y: (pixelPos.y / containerHeight) * 100
});
