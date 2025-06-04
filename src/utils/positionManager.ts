
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
const HERO_SECTION_HEIGHT = 400; // Height of hero section to position notes below

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
  // Calculate usable area starting below hero section
  const minY = HERO_SECTION_HEIGHT + VIEWPORT_PADDING;
  const usableWidth = containerWidth - NOTE_WIDTH - (VIEWPORT_PADDING * 2);
  
  // First try to fill current screen space
  const currentScreenMaxY = Math.max(window.innerHeight - NOTE_HEIGHT - VIEWPORT_PADDING, minY);
  const currentScreenHeight = currentScreenMaxY - minY;
  
  // Try grid positioning within current screen first
  const gridPosition = findGridPositionInArea(
    existingPositions, 
    containerWidth, 
    minY, 
    currentScreenMaxY
  );
  
  if (gridPosition) {
    return gridPosition;
  }
  
  // If no space in current screen, extend below
  const extendedMaxY = containerHeight - VIEWPORT_PADDING;
  return findGridPositionInArea(
    existingPositions,
    containerWidth,
    currentScreenMaxY,
    extendedMaxY
  ) || findGridPositionInArea(existingPositions, containerWidth, minY, extendedMaxY);
};

const findGridPositionInArea = (
  existingPositions: Position[],
  containerWidth: number,
  startY: number,
  maxY: number
): Position | null => {
  const cols = Math.floor((containerWidth - VIEWPORT_PADDING * 2) / (NOTE_WIDTH + MIN_SPACING));
  const startX = VIEWPORT_PADDING;
  
  let row = 0;
  
  while (true) {
    const y = startY + row * (NOTE_HEIGHT + MIN_SPACING);
    
    // If we've exceeded the allowed area, return null
    if (y + NOTE_HEIGHT > maxY) {
      return null;
    }
    
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (NOTE_WIDTH + MIN_SPACING);
      const gridPosition = { x, y };
      
      if (!checkCollision(gridPosition, existingPositions)) {
        return gridPosition;
      }
    }
    
    row++;
  }
};

export const calculateRequiredHeight = (positions: Position[]): number => {
  if (positions.length === 0) return window.innerHeight;
  
  const maxY = Math.max(...positions.map(pos => pos.y));
  const requiredHeight = maxY + NOTE_HEIGHT + VIEWPORT_PADDING;
  
  // Only extend beyond current screen if notes actually need the space
  const minRequiredHeight = Math.max(requiredHeight, window.innerHeight);
  
  return minRequiredHeight;
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
