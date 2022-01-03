import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Button, Grid, TextField, ToggleButton } from '@mui/material';
import { v4 } from 'uuid';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import { ImageProps } from '../types';
import {
  ArrowDownward,
  ArrowUpward,
  Delete,
  Link,
  LinkOff,
} from '@mui/icons-material';

export interface SidebarImageProps {
  handleDeleteImage: (id: string) => void;
  handleImageUpload: (images: ImageProps[]) => void;
  handleMoveToBack: (id: string) => void;
  handleMoveToFront: (id: string) => void;
  handleUpdateImage: (image: ImageProps) => void;
  resetSelect: () => void;
  selectedImage?: ImageProps;
}

const Input = styled('input')({
  display: 'none',
});

const SidebarImage = ({
  handleDeleteImage,
  handleImageUpload,
  handleMoveToBack,
  handleMoveToFront,
  handleUpdateImage,
  resetSelect,
  selectedImage,
}: SidebarImageProps) => {
  const [imageWidth, setImageWidth] = useState<string>('');
  const [imageHeight, setImageHeight] = useState<string>('');
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [keepRatio, setKeepRatio] = useState<boolean>(true);

  const [imageWidthError, setImageWidthError] = useState<boolean>(false);
  const [imageHeightError, setImageHeightError] = useState<boolean>(false);

  useEffect(() => {
    if (selectedImage) {
      // set all values from selected image in sidebar
      setImageWidth(selectedImage.width.toString());
      setImageHeight(selectedImage.height.toString());
      setImageRotation(selectedImage.rotation);

      // reset errors
      setImageWidthError(false);
      setImageHeightError(false);
    }
  }, [selectedImage]);

  const uploadImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    // cast file list to array
    const uploads = event.target.files ? Array.from(event.target.files) : [];
    // reset value so same image can be uploaded again and change is detected
    event.target.value = '';
    return handleImageUpload(
      uploads.map((file) => ({
        height: 0,
        id: v4(),
        imageUrl: URL.createObjectURL(file),
        rotation: 0,
        width: 0,
        x: 10,
        y: 10,
      })),
    );
  };

  const updateWidth = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setImageWidthError(false);
    setImageWidth(event.target.value);

    if (event.target.value == '' || parseInt(event.target.value) < 1) {
      setImageWidthError(true);
      return;
    }

    const value = parseInt(event.target.value);
    selectedImage &&
      handleUpdateImage({
        ...selectedImage,
        width: value,
        // update height accordingly, if ratio should be kept
        height: keepRatio
          ? value * (selectedImage.height / selectedImage.width)
          : selectedImage.height,
      });
  };

  const updateWHeight = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setImageHeightError(false);
    setImageHeight(event.target.value);

    if (event.target.value == '' || parseInt(event.target.value) < 1) {
      setImageHeightError(true);
      return;
    }

    const value = parseInt(event.target.value);
    selectedImage &&
      handleUpdateImage({
        ...selectedImage,
        height: value,
        // update width accordingly, if ratio should be kept
        width: keepRatio
          ? value * (selectedImage.width / selectedImage.height)
          : selectedImage.width,
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <label htmlFor="uploadImage">
          <Input
            accept="image/*"
            id="uploadImage"
            multiple
            type="file"
            onChange={(event) => uploadImages(event)}
          />
          <Button
            fullWidth={true}
            variant="contained"
            sx={{ marginBottom: 1 }}
            startIcon={<PhotoCamera />}
            component="span"
            // deselect any item, parent callback
            onClick={() => resetSelect()}
          >
            Upload image(s)
          </Button>
        </label>
      </Grid>
      <Grid item xs={12}>
        {!selectedImage && (
          <Alert severity="info">
            Click on an image in the drawing area to be able to edit its
            properties.
          </Alert>
        )}
      </Grid>
      <Grid item xs={12} md={5}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          inputProps={{
            step: 10,
            min: 10,
            type: 'number',
          }}
          label="Image width (px)"
          disabled={!selectedImage}
          error={selectedImage && imageWidthError}
          helperText={
            selectedImage &&
            imageWidthError &&
            'Width value needs to be a number bigger than 0.'
          }
          value={selectedImage ? imageWidth : ''}
          onChange={(event) => updateWidth(event)}
        />
      </Grid>
      <Grid item xs={12} md={2} textAlign="center">
        <ToggleButton
          size="small"
          value="check"
          selected={keepRatio}
          onChange={() => {
            setKeepRatio(!keepRatio);
          }}
        >
          {keepRatio && <Link />}
          {!keepRatio && <LinkOff />}
        </ToggleButton>
      </Grid>
      <Grid item xs={12} md={5}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          inputProps={{
            step: 10,
            min: 10,
            type: 'number',
          }}
          label="Image height (px)"
          disabled={!selectedImage}
          error={selectedImage && imageHeightError}
          helperText={
            selectedImage &&
            imageHeightError &&
            'Height value needs to be a number bigger than 0.'
          }
          value={selectedImage ? imageHeight : ''}
          onChange={(event) => updateWHeight(event)}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          inputProps={{
            step: 1,
            type: 'number',
          }}
          label="Image rotation (degree)"
          disabled={!selectedImage}
          value={selectedImage ? imageRotation.toFixed(2) : ''}
          onChange={(event) => {
            const value = parseInt(event.target.value);
            setImageRotation(value);
            selectedImage &&
              handleUpdateImage({
                ...selectedImage,
                rotation: value,
              });
          }}
        />
      </Grid>
      <Grid item xs={12} />
      <Grid item xs={12} md={6}>
        <Button
          size="small"
          fullWidth={true}
          variant="outlined"
          startIcon={<ArrowUpward />}
          disabled={!selectedImage}
          onClick={() => selectedImage && handleMoveToFront(selectedImage.id)}
        >
          To front
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          size="small"
          fullWidth={true}
          variant="outlined"
          startIcon={<ArrowDownward />}
          disabled={!selectedImage}
          onClick={() => selectedImage && handleMoveToBack(selectedImage.id)}
        >
          To back
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          size="small"
          fullWidth={true}
          variant="outlined"
          startIcon={<Delete />}
          disabled={!selectedImage}
          onClick={() => {
            selectedImage && handleDeleteImage(selectedImage.id);
            // deselect any item, parent callback
            resetSelect();
          }}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};
export default SidebarImage;
