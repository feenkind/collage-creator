import * as React from 'react';
import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { Download, ExpandMore, ZoomIn, ZoomOut } from '@mui/icons-material';
import Konva from 'konva';
import { downloadURI } from '../utils';
import SidebarImage, { SidebarImageProps } from './SidebarImage';
import SidebarDownloadArea, {
  SidebarDownloadAreaProps,
} from './SidebarDownloadArea';
import SidebarText, { SidebarTextProps } from './SidebarText';
import Help from './Help';

interface SidebarProps
  extends SidebarDownloadAreaProps,
    SidebarImageProps,
    SidebarTextProps {
  stageRef?: React.RefObject<Konva.Stage>;
  handleDownloadInProgress: (visible: boolean) => void;
  handleScale: (scale: number) => void;
}

const Sidebar = ({
  handleAddText,
  handleDeleteImage,
  handleDeleteText,
  handleDownloadAreaColor,
  handleDownloadAreaHeight,
  handleDownloadAreaWidth,
  handleDownloadInProgress,
  handleImageUpload,
  handleMoveToBack,
  handleMoveToFront,
  handleScale,
  handleUpdateImage,
  handleUpdateText,
  resetSelect,
  selectedImage,
  selectedText,
  stageRef,
}: SidebarProps) => {
  const [downloadAreaWidth, setDownloadAreaWidth] = useState<number>(500);
  const [downloadAreaHeight, setDownloadAreaHeight] = useState<number>(500);
  const [scale, setScale] = useState<number>(1);

  const onImageDownload = () => {
    const uri =
      stageRef &&
      stageRef.current &&
      stageRef.current.toDataURL({
        width: downloadAreaWidth,
        height: downloadAreaHeight,
        x: 10,
        y: 10,
      });
    // download when uri exists
    uri && downloadURI(uri, 'rma-collage-creator.png');
  };

  return (
    <Grid
      item
      xs={4}
      borderLeft={1}
      padding={2}
      sx={{ maxHeight: '100vh' }}
      overflow="scroll"
    >
      <Typography
        component="h1"
        variant="h5"
        textAlign="center"
        py={2}
        borderBottom="1px solid grey"
      >
        RMA Collage Creator WS 21/22
      </Typography>

      <Box py={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Help />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              fullWidth={true}
              startIcon={<ZoomOut />}
              // zoom is disabled when minimum zoom is reached
              disabled={scale < 0.2}
              onClick={() => {
                handleScale(scale - 0.1);
                setScale(scale - 0.1);
              }}
            >
              Zoom out
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              fullWidth={true}
              startIcon={<ZoomIn />}
              // zoom is disabled when maximum zoom is reached
              disabled={scale > 0.9}
              onClick={() => {
                handleScale(scale + 0.1);
                setScale(scale + 0.1);
              }}
            >
              Zoom in
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Accordion
        defaultExpanded={true}
        square={true}
        sx={{ boxShadow: 'none' }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="button">Drawing Area</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SidebarDownloadArea
            handleDownloadAreaColor={handleDownloadAreaColor}
            handleDownloadAreaHeight={(height) => {
              // download area size also is needed here for download function
              setDownloadAreaHeight(height);
              handleDownloadAreaHeight(height);
            }}
            handleDownloadAreaWidth={(width) => {
              // download area size also is needed here for download function
              setDownloadAreaWidth(width);
              handleDownloadAreaWidth(width);
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded={true}
        square={true}
        sx={{ boxShadow: 'none' }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="button">Images</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SidebarImage
            handleDeleteImage={handleDeleteImage}
            handleImageUpload={handleImageUpload}
            handleMoveToBack={handleMoveToBack}
            handleMoveToFront={handleMoveToFront}
            handleUpdateImage={handleUpdateImage}
            resetSelect={resetSelect}
            selectedImage={selectedImage}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded={true}
        square={true}
        sx={{ boxShadow: 'none' }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="button">Text</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SidebarText
            handleAddText={handleAddText}
            handleDeleteText={handleDeleteText}
            handleUpdateText={handleUpdateText}
            resetSelect={resetSelect}
            selectedText={selectedText}
          />
        </AccordionDetails>
      </Accordion>

      <Box my={3}>
        <Button
          variant="contained"
          fullWidth={true}
          startIcon={<Download />}
          onClick={() => {
            // deselect any item, parent callback
            resetSelect();
            // hide download area borders for download
            handleDownloadInProgress(true);
            // set timeout before download, so all items are deselected on the download
            setTimeout(() => onImageDownload(), 1000);
            // show download area borders again, also with timeout so they are not visible on the downloaded image
            setTimeout(() => handleDownloadInProgress(false), 1000);
          }}
        >
          Download Collage
        </Button>
      </Box>
    </Grid>
  );
};

export default Sidebar;
