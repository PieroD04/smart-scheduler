import { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function SpeedDialTooltipOpen({handleAdd, handleOptimize, handleExport}: {handleAdd: () => void, handleOptimize: () => void, handleExport: () => void}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    { icon: <AddIcon />, name: 'Add', action: handleAdd },
    { icon: <BuildIcon />, name: 'Optimize', action: handleOptimize },
    { icon: <FileDownloadIcon />, name: 'Export', action: handleExport }
  ];

  return (
    <SpeedDial
        ariaLabel="SpeedDial tooltip"
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.action}
          />
        ))}
      </SpeedDial>
  );
}
