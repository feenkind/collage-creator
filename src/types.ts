// general item interface
interface Item {
  id: string;
  rotation: number;
  x: number;
  y: number;
}

// interface for text properties
export interface TextProps extends Item {
  backgroundColor: string;
  color: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  value: string;
}

// interface for image properties
export interface ImageProps extends Item {
  height: number;
  imageUrl: string;
  width: number;
}
