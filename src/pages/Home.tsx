import { useState } from "react";
import ScheduleForm from "../components/ScheduleForm";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleTable from "../components/ScheduleTable";
import Scheduler from "../components/Scheduler";
import useEntries from "../hooks/useEntries";
import useSelectedEntries from "../hooks/useSelectedEntries";

export default function Home() {
    const [open, setOpen] = useState(false);

    const { entries, addEntry, deleteEntry } = useEntries();
    const { selectedEntries, toggleSelectedEntry } = useSelectedEntries();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold p-2">Smart Scheduler</h1>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
            >Add Schedule</Button>
            <div className="lg:w-3/4 sm:w-full mx-auto">
                <ScheduleTable entries={entries} selectedEntries={selectedEntries} toggleSelectedEntry={toggleSelectedEntry} deleteEntry={deleteEntry} />
            </div>
            <div className="m-5">
                <Scheduler selectedEntries={selectedEntries} />
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <div className="flex flex-row justify-between align-middle items-center">
                        <div className="text-center font-semibold text-xl">Schedule Form</div>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <ScheduleForm addEntry={addEntry} handleDialogClose={handleClose} />
                </DialogContent>
            </Dialog>
        </div>
    )
}