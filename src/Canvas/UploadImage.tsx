import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { ImageProps } from '../types';

interface UploadImageProps {
  handleUpdateImage: (image: ImageProps) => void;
  image: ImageProps;
  isSelected?: boolean;
  onSelect: () => void;
}

const UploadImage = ({
  handleUpdateImage,
  image,
  isSelected,
  onSelect,
}: UploadImageProps) => {
  const imageRef = useRef<Konva.Image>(null);
  const tranformerRef = useRef<Konva.Transformer>(null);
  // image hook for konva to create an html image
  const [img] = useImage(image.imageUrl);

  useEffect(() => {
    // called when isSelected changes
    // attach transformer
    if (tranformerRef.current && imageRef.current) {
      tranformerRef.current.nodes([imageRef.current]);
      tranformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    // when image is loaded, update width and height in state
    // other dependencies lead to infinite reloads
    if (img) {
      handleUpdateImage({
        ...image,
        width: img.width,
        height: img.height,
      });
    }
  }, [img]);

  const updateImageAfterTransform = () => {
    const node = imageRef.current;
    if (!node) return;

    // get scale factor after transform
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // reset scale
    node.scaleX(1);
    node.scaleY(1);

    // update all image data, so it is correct after transforming
    handleUpdateImage({
      ...image,
      x: node.x(),
      y: node.y(),
      width: Math.round((node.width() * scaleX * 100) / 100),
      height: Math.round((node.height() * scaleY * 100) / 100),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <KonvaImage
        ref={imageRef}
        onClick={onSelect}
        draggable={isSelected}
        image={img}
        width={image.width}
        height={image.height}
        x={image.x}
        y={image.y}
        rotation={image.rotation}
        onDragEnd={(event) => {
          // update image position in state after moving
          handleUpdateImage({
            ...image,
            x: event.target.x(),
            y: event.target.y(),
          });
        }}
        // update image in state after transformation
        onTransformEnd={() => updateImageAfterTransform()}
      />
      {isSelected && <Transformer ref={tranformerRef} />}
    </>
  );
};

export default UploadImage;
