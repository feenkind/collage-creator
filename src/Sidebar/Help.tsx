import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

const Help = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        fullWidth={true}
        onClick={() => setOpen(true)}
      >
        Instructions
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>What is this about and how does it work?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography component="p">
              {'This is a student\'s project for "Rich Media Applikationen WS21/22". It is written in TypeScript with ReactJS, KonvaJS and Material UI.' +
                ' Users can interactively create image and text collages and download their creations. It is not optimized for mobile for now. ' +
                'These are the features: '}
            </Typography>
            <Typography component="p" fontWeight="bold" marginTop={1}>
              Download and zoom
            </Typography>
            <Typography component="p">
              {'The download button triggers a .png download of the drawing area (displayed as rectangle with a black border).' +
                ' During the download, the border is hidden so it will not appear on the downloaded image.' +
                ' With the zoom buttons, the zoom on the canvas can be increased or decreased in 10% steps.' +
                ' When the minimum/maxium is reached, the buttons are disabled.'}
            </Typography>
            <Typography component="p" fontWeight="bold" marginTop={1}>
              Drawing area
            </Typography>
            <Typography component="p">
              {'The drawing area specifies the area for the export. The size can be adapted with drawing area width and drawing area height.' +
                'By default the background is transparent, but a background color can be specified when the background color checkbox is checked. ' +
                'The area can be cleared by reloading the window.'}
            </Typography>
            <Typography component="p" fontWeight="bold" marginTop={1}>
              Images
            </Typography>
            <Typography component="p">
              {'One or more images at the same time can be uploaded via the "Upload Image(s)" button. ' +
                'By clicking on an image on the canvas, it is selected and can then be moved, rotated or resized with the mouse. ' +
                'When an image is selected, its properties are also displayed in the sidebar and can be changed there. ' +
                'When the link toggle is active, the ratio is kept when changing either width or height. ' +
                'The selected image can either be moved to the front or back with buttons or get deleted.'}
            </Typography>
            <Typography component="p" fontWeight="bold" marginTop={1}>
              Texts
            </Typography>
            <Typography component="p">
              {'Texts can be added by inserting text in the "Insert new text" input and clicking the "Add text" button. ' +
                'By clicking on a text on the canvas, it is selected and can be moved or rotatet width the mouse. ' +
                'When a text is selected, its properties are displayed in the sidebar and can be changed there. ' +
                'A text value can be changed by the input field, and the font family, font size, rotation and color can be set. ' +
                'A text can also have a background color. For this, the checkbox needs to be set and a color and padding for the text can be chosen.' +
                ' As images, selected texts can also get deleted.'}
            </Typography>
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Help;
