import * as React from 'react';
import { useState } from 'react';
import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';

export interface SidebarDownloadAreaProps {
  handleDownloadAreaColor: (color: string) => void;
  handleDownloadAreaHeight: (width: number) => void;
  handleDownloadAreaWidth: (width: number) => void;
}

const SidebarDownloadArea = ({
  handleDownloadAreaColor,
  handleDownloadAreaHeight,
  handleDownloadAreaWidth,
}: SidebarDownloadAreaProps) => {
  const [hasDownloadAreaColor, setHasDownloadAreaColor] =
    useState<boolean>(false);
  const [downloadAreaColor, setDownloadAreaColor] = useState<string>('#ffffff');
  const [downloadAreaWidth, setDownloadAreaWidth] = useState<string>('500');
  const [downloadAreaHeight, setDownloadAreaHeight] = useState<string>('500');

  const [widthError, setWidthError] = useState<boolean>(false);
  const [heightError, setHeightError] = useState<boolean>(false);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          inputProps={{
            step: 10,
            min: 10,
            type: 'number',
          }}
          label="Drawing area width (px)"
          error={widthError}
          helperText={
            widthError && 'Width value needs to be a number bigger than 0.'
          }
          value={downloadAreaWidth}
          onChange={(event) => {
            setWidthError(false);
            setDownloadAreaWidth(event.target.value);

            // validation
            if (event.target.value == '' || parseInt(event.target.value) < 1) {
              setWidthError(true);
              return;
            }

            handleDownloadAreaWidth(parseInt(event.target.value));
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          inputProps={{
            step: 10,
            min: 10,
            type: 'number',
          }}
          label="Drawing area height (px)"
          error={heightError}
          helperText={
            heightError && 'Height value needs to be a number bigger than 0.'
          }
          value={downloadAreaHeight}
          onChange={(event) => {
            setHeightError(false);
            setDownloadAreaHeight(event.target.value);

            // validation
            if (event.target.value == '' || parseInt(event.target.value) < 1) {
              setHeightError(true);
              return;
            }

            handleDownloadAreaHeight(parseInt(event.target.value));
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasDownloadAreaColor}
              onChange={(event) => {
                setHasDownloadAreaColor(event.target.checked);
                // background is transparent if not checked
                handleDownloadAreaColor(
                  event.target.checked ? downloadAreaColor : 'transparent',
                );
              }}
            />
          }
          label="Background color"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth={true}
          variant="standard"
          type="color"
          size="small"
          label="Background color"
          disabled={!hasDownloadAreaColor}
          value={downloadAreaColor}
          onChange={(event) => {
            setDownloadAreaColor(event.target.value);
            handleDownloadAreaColor(event.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SidebarDownloadArea;
