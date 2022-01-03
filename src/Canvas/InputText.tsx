import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Label, Tag, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { TextProps } from '../types';

interface InputTextProps {
  handleUpdateText: (text: TextProps) => void;
  isSelected?: boolean;
  onSelect: () => void;
  text: TextProps;
}

const InputText = ({
  handleUpdateText,
  isSelected,
  onSelect,
  text,
}: InputTextProps) => {
  const textRef = useRef<Konva.Label>(null);
  const tranformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    // called when text or is selected changes
    // attach transformer
    if (tranformerRef.current && textRef.current) {
      tranformerRef.current.nodes([textRef.current]);
      tranformerRef.current.getLayer()?.batchDraw();
    }
  }, [text, isSelected]);

  const updateTextAfterTransform = () => {
    const node = textRef.current;
    if (!node) return;

    // update all text data, so it is correct after transforming
    handleUpdateText({
      ...text,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    });
  };

  return (
    <>
      <Label
        draggable={isSelected}
        ref={textRef}
        x={text.x}
        y={text.y}
        rotation={text.rotation}
        onClick={onSelect}
        onDragEnd={(event) => {
          // update position after drag ends
          handleUpdateText({
            ...text,
            x: event.target.x(),
            y: event.target.y(),
          });
        }}
        onTransformEnd={() => updateTextAfterTransform()}
      >
        <Tag fill={text.backgroundColor} />
        <Text
          text={text.value}
          fontSize={text.fontSize}
          fill={text.color}
          fontFamily={text.fontFamily}
          padding={text.padding}
        />
      </Label>
      {isSelected && (
        // disable resize via transformer because it leads to weird font display
        <Transformer ref={tranformerRef} resizeEnabled={false} />
      )}
    </>
  );
};

export default InputText;
