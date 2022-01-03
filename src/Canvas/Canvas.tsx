import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import { Layer, Line, Rect, Stage } from 'react-konva';
import Konva from 'konva';
import UploadImage from './UploadImage';
import InputText from './InputText';
import { grey } from '@mui/material/colors';
import { ImageProps, TextProps } from '../types';
import DownloadInProgress from './DownloadInProgress';

interface CanvasProps {
  downloadAreaColor: string;
  downloadAreaHeight: number;
  downloadAreaWidth: number;
  downloadInProgress: boolean;
  handleCanvasLoad: (ref: React.RefObject<Konva.Stage>) => void;
  handleSelect: (selected: string) => void;
  handleUpdateImage: (image: ImageProps) => void;
  handleUpdateText: (text: TextProps) => void;
  images: ImageProps[];
  scale: number;
  selectedId: string;
  texts: TextProps[];
}

const Canvas = ({
  downloadAreaColor,
  downloadAreaHeight,
  downloadAreaWidth,
  downloadInProgress,
  handleCanvasLoad,
  handleSelect,
  handleUpdateImage,
  handleUpdateText,
  images,
  scale,
  selectedId,
  texts,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    // when loaded, pass stage ref to parent for being able to download the image in the sidebar
    handleCanvasLoad(stageRef);
  }, [handleCanvasLoad, stageRef]);

  // when download area is bigger then parent div width,
  // set canvas width to download area, otherwise to parent div width
  const canvasWidth = canvasRef.current
    ? canvasRef.current.offsetWidth > downloadAreaWidth
      ? // 16 is the margin of the mui grid component
        canvasRef.current.offsetWidth - 16
      : downloadAreaWidth + 20
    : 0;

  // when download area is bigger then parent div height,
  // set canvas height to download area, otherwise to parent div height
  const canvasHeight = canvasRef.current
    ? canvasRef.current.offsetHeight > downloadAreaHeight
      ? // 16 is the margin of the mui grid component
        canvasRef.current.offsetHeight - 16
      : downloadAreaHeight + 20
    : 0;

  return (
    <Grid
      item
      xs={8}
      ref={canvasRef}
      bgcolor={grey[300]}
      sx={{ maxHeight: '100vh' }}
      overflow="auto"
    >
      {
        // display div over canvas during download, to hide all resizing and invisible setting
        downloadInProgress && <DownloadInProgress />
      }
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        ref={stageRef}
        onMouseDown={(event) => {
          // deselect when click was outside of any element
          if (event.target === event.target.getStage()) {
            handleSelect('');
          }
        }}
        // set scale to 1 during export to have the correct distances
        // as pixel ratio manipulation on export only interpolates and the result is not 100% correct
        scale={{
          x: !downloadInProgress ? scale : 1,
          y: !downloadInProgress ? scale : 1,
        }}
      >
        <Layer>
          <Rect
            // download area indicator and background
            width={downloadAreaWidth}
            height={downloadAreaHeight}
            x={10}
            y={10}
            fill={downloadAreaColor}
            onMouseDown={() => handleSelect('')}
          />
          {
            // draw all uploaded images
            images.map((image) => (
              <UploadImage
                key={image.id}
                image={image}
                isSelected={image.id === selectedId}
                onSelect={() => {
                  // click from image is passed up here
                  handleSelect(image.id);
                }}
                handleUpdateImage={(image) => handleUpdateImage(image)}
              />
            ))
          }
          {
            // draw all entered texts
            texts.map((text) => (
              <InputText
                isSelected={text.id === selectedId}
                key={text.id}
                text={text}
                onSelect={() => {
                  // click from text is passed up here
                  handleSelect(text.id);
                }}
                handleUpdateText={(text) => handleUpdateText(text)}
              />
            ))
          }
          <Line
            // the border for the drawing area sits on top of everything, but should not be visible when image is downloaded
            visible={!downloadInProgress}
            stroke="black"
            strokeWidth={1}
            points={[
              10,
              10,
              downloadAreaWidth + 10,
              10,
              downloadAreaWidth + 10,
              downloadAreaHeight + 10,
              10,
              downloadAreaHeight + 10,
              10,
              10,
            ]}
          />
        </Layer>
      </Stage>
    </Grid>
  );
};

export default Canvas;
