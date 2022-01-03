import * as React from 'react';
import { useState } from 'react';
import { Grid } from '@mui/material';
import Canvas from './Canvas/Canvas';
import Sidebar from './Sidebar/Sidebar';
import Konva from 'konva';
import { ImageProps, TextProps } from './types';

export default function App() {
  // state is lifted up so changes from the sidebar can be transferred to the canvas
  const [images, setImages] = useState<ImageProps[]>([]);
  const [texts, setTexts] = useState<TextProps[]>([]);

  const [stageRef, setStageRef] = useState<
    React.RefObject<Konva.Stage> | undefined
  >(undefined);

  const [selected, setSelected] = useState<string>('');

  const [downloadAreaColor, setDownloadAreaColor] =
    useState<string>('transparent');
  const [downloadAreaWidth, setDownloadAreaWidth] = useState<number>(500);
  const [downloadAreaHeight, setDownloadAreaHeight] = useState<number>(500);
  const [downloadInProgress, setDownloadInProgress] = useState<boolean>(false);

  const [scale, setScale] = useState<number>(1);

  const moveImage = (id: string, direction: 'FRONT' | 'BACK') => {
    const image = images.find((image) => image.id === id);
    const index = images.findIndex((image) => image.id === id);
    if (!image || index === -1) return;

    // create copy, remove selected image, then add on top or end of array
    const tempImages = images.slice();
    tempImages.splice(index, 1);
    if (direction == 'FRONT') {
      tempImages.push(image);
    } else {
      tempImages.unshift(image);
    }

    setImages(tempImages);
  };

  const updateImage = (image: ImageProps) => {
    const index = images.findIndex((img) => img.id === image.id);
    if (index > -1) {
      const tempImages = images.slice();
      tempImages[index] = image;
      // trigger rerender by setting the images
      setImages(tempImages);
    }
  };

  const updateText = (text: TextProps) => {
    const index = texts.findIndex((txt) => txt.id === text.id);
    if (index > -1) {
      const tempTexts = texts.slice();
      tempTexts[index] = text;
      // trigger rerender by setting the texts
      setTexts(tempTexts);
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: '100vh' }}>
      <Canvas
        downloadAreaColor={downloadAreaColor}
        downloadAreaHeight={downloadAreaHeight}
        downloadAreaWidth={downloadAreaWidth}
        downloadInProgress={downloadInProgress}
        handleCanvasLoad={(ref) => setStageRef(ref)}
        handleSelect={(selected) => setSelected(selected)}
        handleUpdateImage={(image: ImageProps) => updateImage(image)}
        handleUpdateText={(text: TextProps) => updateText(text)}
        images={images}
        scale={scale}
        selectedId={selected}
        texts={texts}
      />
      <Sidebar
        handleAddText={(text) => setTexts(texts.concat(text))}
        handleDeleteImage={(id) =>
          // remove selected id from images array
          setImages(images.filter((image) => image.id != id))
        }
        handleDeleteText={(id) =>
          // remove selected id from texts array
          setTexts(texts.filter((text) => text.id != id))
        }
        handleDownloadAreaColor={(color) => setDownloadAreaColor(color)}
        handleDownloadAreaHeight={(height) => setDownloadAreaHeight(height)}
        handleDownloadAreaWidth={(width) => setDownloadAreaWidth(width)}
        handleDownloadInProgress={(visible) => setDownloadInProgress(visible)}
        handleImageUpload={(uploadedImages) => {
          // add new images to array
          return setImages(images.concat(uploadedImages));
        }}
        handleMoveToBack={(id) => {
          moveImage(id, 'BACK');
        }}
        handleMoveToFront={(id) => {
          moveImage(id, 'FRONT');
        }}
        handleScale={(scale) => setScale(scale)}
        handleUpdateImage={(image) => updateImage(image)}
        handleUpdateText={(text: TextProps) => updateText(text)}
        resetSelect={() => setSelected('')}
        selectedImage={images.find((image) => image.id === selected)}
        selectedText={texts.find((text) => text.id === selected)}
        stageRef={stageRef}
      />
    </Grid>
  );
}
