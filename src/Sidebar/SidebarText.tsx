import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material';
import { TextProps } from '../types';
import { Add, Delete } from '@mui/icons-material';
import { v4 } from 'uuid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export interface SidebarTextProps {
  handleAddText: (text: TextProps) => void;
  handleDeleteText: (id: string) => void;
  handleUpdateText: (text: TextProps) => void;
  resetSelect: () => void;
  selectedText?: TextProps;
}

const SidebarText = ({
  handleAddText,
  handleDeleteText,
  handleUpdateText,
  resetSelect,
  selectedText,
}: SidebarTextProps) => {
  const [newTextInput, setNewTextInput] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('');
  const [fontSizeInput, setFontSizeInput] = useState<string>('');
  const [textRotation, setTextRotation] = useState<number>(0);
  const [paddingInput, setPaddingInput] = useState<string>('');

  const [colorInput, setColorInput] = useState<string>('#000000');
  const [backgroundColorInput, setBackgroundColorInput] =
    useState<string>('#ffffff');
  const [hasTextBackgroundColor, setHasTextBackgroundColor] =
    useState<boolean>(false);

  const [fontSizeError, setFontSizeError] = useState<boolean>(false);
  const [paddingError, setPaddingError] = useState<boolean>(false);

  useEffect(() => {
    if (selectedText) {
      // set all values from selected text in sidebar
      setTextInput(selectedText.value);
      setFontFamily(selectedText.fontFamily);
      setFontSizeInput(selectedText.fontSize.toString());
      setTextRotation(selectedText.rotation);
      setPaddingInput(selectedText.padding.toString());

      setColorInput(selectedText.color);
      setHasTextBackgroundColor(selectedText.backgroundColor !== 'transparent');
      setBackgroundColorInput(
        selectedText.backgroundColor !== 'transparent'
          ? selectedText.backgroundColor
          : '#ffffff',
      );

      // reset errors
      setFontSizeError(false);
      setPaddingError(false);
    }
  }, [selectedText]);

  const addText = () => {
    handleAddText({
      backgroundColor: 'transparent',
      color: '#000000',
      fontFamily: 'Roboto',
      fontSize: 30,
      id: v4(),
      padding: 0,
      rotation: 0,
      value: newTextInput,
      x: 10,
      y: 10,
    });
    // reset input
    setNewTextInput('');
  };

  const updateFontSize = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setFontSizeError(false);
    setFontSizeInput(event.target.value);

    if (event.target.value == '' || parseInt(event.target.value) < 1) {
      setFontSizeError(true);
      return;
    }

    selectedText &&
      handleUpdateText({
        ...selectedText,
        fontSize: parseInt(event.target.value),
      });
  };

  const updatePadding = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPaddingError(false);
    setPaddingInput(event.target.value);

    if (event.target.value == '' || parseInt(event.target.value) < 1) {
      setPaddingError(true);
      return;
    }

    selectedText &&
      handleUpdateText({
        ...selectedText,
        padding: parseInt(event.target.value),
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          label="Insert new text"
          value={newTextInput}
          onChange={(event) => {
            // reset select as soon as new text is input
            resetSelect();
            setNewTextInput(event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          fullWidth={true}
          startIcon={<Add />}
          disabled={newTextInput === ''}
          onClick={() => addText()}
        >
          Add text
        </Button>
      </Grid>
      <Grid item xs={12}>
        {!selectedText && (
          <Alert severity="info">
            Click on a text in the drawing area to be able to edit its
            properties.
          </Alert>
        )}
      </Grid>
      <Grid item xs={12}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          label="Text value"
          disabled={!selectedText}
          value={selectedText ? textInput : ''}
          onChange={(event) => {
            setTextInput(event.target.value);
            selectedText &&
              event.target.value != '' &&
              handleUpdateText({
                ...selectedText,
                value: event.target.value,
              });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl
          variant="standard"
          fullWidth={true}
          size="small"
          disabled={!selectedText}
        >
          <InputLabel id="fontFamilyLabel">Font family</InputLabel>
          <Select
            labelId="fontFamilyLabel"
            value={fontFamily}
            onChange={(event) => {
              setFontFamily(event.target.value);
              selectedText &&
                handleUpdateText({
                  ...selectedText,
                  fontFamily: event.target.value,
                });
            }}
          >
            <MenuItem value="Roboto">Roboto</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Courier">Courier</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          label="Text size"
          disabled={!selectedText}
          inputProps={{
            step: 10,
            min: 10,
            max: 200,
            type: 'number',
          }}
          error={selectedText && fontSizeError}
          helperText={
            selectedText &&
            fontSizeError &&
            'Text size value needs to be a number bigger than 0.'
          }
          value={selectedText ? fontSizeInput : ''}
          onChange={(event) => updateFontSize(event)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          inputProps={{
            step: 1,
            type: 'number',
          }}
          label="Text rotation (degree)"
          disabled={!selectedText}
          value={selectedText ? textRotation.toFixed(2) : ''}
          onChange={(event) => {
            const value = parseInt(event.target.value);
            setTextRotation(value);
            selectedText &&
              handleUpdateText({
                ...selectedText,
                rotation: value,
              });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth={true}
          variant="standard"
          type="color"
          size="small"
          label="Color"
          disabled={!selectedText}
          value={selectedText ? colorInput : '#000000'}
          onChange={(event) => {
            setColorInput(event.target.value);
            selectedText &&
              handleUpdateText({
                ...selectedText,
                color: event.target.value,
              });
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedText ? hasTextBackgroundColor : false}
              disabled={!selectedText}
              onChange={(event) => {
                setHasTextBackgroundColor(event.target.checked);
                selectedText &&
                  handleUpdateText({
                    ...selectedText,
                    backgroundColor: event.target.checked
                      ? backgroundColorInput
                      : 'transparent',
                    padding: event.target.checked ? parseInt(paddingInput) : 0,
                  });
              }}
            />
          }
          label="Text background color"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth={true}
          variant="standard"
          type="color"
          size="small"
          label="Background color"
          disabled={!selectedText || !hasTextBackgroundColor}
          value={selectedText ? backgroundColorInput : '#ffffff'}
          onChange={(event) => {
            setBackgroundColorInput(event.target.value);
            selectedText &&
              handleUpdateText({
                ...selectedText,
                backgroundColor: event.target.value,
              });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          size="small"
          variant="standard"
          fullWidth={true}
          label="Text padding"
          // padding is only enabled when background color is set
          disabled={!selectedText || !hasTextBackgroundColor}
          inputProps={{
            step: 1,
            min: 0,
            max: 100,
            type: 'number',
          }}
          error={selectedText && hasTextBackgroundColor && paddingError}
          helperText={
            selectedText &&
            paddingError &&
            'Padding value needs to be a number bigger than 0.'
          }
          // value is reset when the text has no background color
          value={selectedText && hasTextBackgroundColor ? paddingInput : ''}
          onChange={(event) => updatePadding(event)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          size="small"
          fullWidth={true}
          variant="outlined"
          startIcon={<Delete />}
          disabled={!selectedText}
          onClick={() => {
            selectedText && handleDeleteText(selectedText.id);
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

export default SidebarText;
