import { useState } from "react";
import ScheduleForm from "../components/ScheduleForm";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import useEntries from "../hooks/useEntries";
import useSelectedEntries from "../hooks/useSelectedEntries";
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleTable from "../components/ScheduleTable";
import Scheduler from "../components/Scheduler";
import ProffesorList from "../components/ProfessorList";
import TimeRangeSelector from "../components/TimeRangeSelector";
import usePreferences from "../hooks/usePreferences";
import optimizeSchedule from "../utils/optimizeSchedule";

export default function Home() {
    const [open, setOpen] = useState(false);
    const { entries, addEntry, deleteEntry } = useEntries();
    const { selectedEntries, updateSelectedEntries, toggleSelectedEntry } = useSelectedEntries();
    const { professors, updateProfessorOrder, timeRange, updateTimeRange } = usePreferences({ entries });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleOptimize = () => {
        const optimizedEntries = optimizeSchedule(entries, professors, timeRange);
        console.log(optimizedEntries);
        updateSelectedEntries(optimizedEntries);
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div className="text-3xl font-bold text-center p-1">Smart Scheduler</div>
            <div className="text-xl font-normal text-center mb-2">Optimize your schedule with ease</div>
            <div className="flex flex-row justify-center items-center gap-5">
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >Add Schedule Entry</Button>
                <Button
                    variant="contained"
                    startIcon={<BuildIcon />}
                    onClick={handleOptimize}
                >Optimize Schedule</Button>
            </div>
            <div className="md:w-11/12 md:mx-auto mt-5">
                <ScheduleTable entries={entries} selectedEntries={selectedEntries} toggleSelectedEntry={toggleSelectedEntry} deleteEntry={deleteEntry} />
            </div>
            <div className="grid grid-rows-1 md:grid-cols-2 gap-5">
                <div className="m-5">
                    <ProffesorList professors={professors} setProfessors={updateProfessorOrder} />
                </div>
                <div className="flex flex-row justify-center items-center gap-5 m-5">
                    <TimeRangeSelector timeRange={timeRange} setTimeRange={updateTimeRange} />
                </div>
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