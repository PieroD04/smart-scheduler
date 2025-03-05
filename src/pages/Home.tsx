import { useState } from "react";
import ScheduleForm from "../components/ScheduleForm";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import useEntries from "../hooks/useEntries";
import useSelectedEntries from "../hooks/useSelectedEntries";
import CloseIcon from '@mui/icons-material/Close';
import ScheduleTable from "../components/ScheduleTable";
import Scheduler from "../components/Scheduler";
import ProffesorList from "../components/ProfessorList";
import TimeRangeSelector from "../components/TimeRangeSelector";
import usePreferences from "../hooks/usePreferences";
import optimizeSchedule from "../utils/optimizeSchedule";
import ScheduleEntry from "../models/ScheduleEntry";
import SpeedDial from "../components/SpeedDial";
import domtoimage from "dom-to-image"
import Footer from "../components/Footer";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null);
    const { entries, addEntry, updateEntry, deleteEntry } = useEntries();
    const { selectedEntries, updateSelectedEntries, toggleSelectedEntry } = useSelectedEntries();
    const { professors, updateProfessorOrder, timeRange, updateTimeRange } = usePreferences({ entries });

    const handleClickOpen = (id: number | null = null) => {
        if (id) setSelectedEntry(entries.find(entry => entry.id === id) || null)
        else setSelectedEntry(null);
        setOpen(true);
    };

    const handleOptimize = () => {
        const optimizedEntries = optimizeSchedule(entries, professors, timeRange);
        updateSelectedEntries(optimizedEntries);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleExport = async () => {
        const element = document.querySelector(".scheduler-container") as HTMLElement;
        console.log(element);
        if (!element) return;

        const scale = window.innerWidth < 768 ? 3 : 2;

        const options = {
            width: element.scrollWidth * scale,
            height: element.scrollHeight * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: `${element.scrollWidth}px`,
                height: `${element.scrollHeight}px`,
            }
        };

        domtoimage.toPng(element, options)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "scheduler.png";
                link.click();
            })
            .catch((error) => {
                console.error("Error exporting schedule:", error);
            });
    };

    return (
        <div>
            <p className="text-3xl font-bold text-center p-5 pb-0">Smart Scheduler</p>
            <p className="text-xl font-light text-center mb-2">Optimize your schedule with ease</p>
            <div className="md:w-11/12 md:mx-auto mt-5">
                <ScheduleTable entries={entries} selectedEntries={selectedEntries} toggleSelectedEntry={toggleSelectedEntry} updateEntry={(id: number) => handleClickOpen(id)} deleteEntry={deleteEntry} />
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
                <Scheduler entries={entries} selectedEntries={selectedEntries} />
            </div>
            <Footer/>
            {/* Dialog and SpeedDial Components that dont affect the main layout */}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <div className="flex flex-row justify-between align-middle items-center">
                        <p className="text-center font-semibold text-xl">Schedule Form</p>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <ScheduleForm entry={selectedEntry} addEntry={addEntry} updateEntry={updateEntry} handleDialogClose={handleClose} />
                </DialogContent>
            </Dialog>
            <div className="fixed bottom-5 right-5">
                <SpeedDial handleAdd={handleClickOpen} handleOptimize={handleOptimize} handleExport={() => { handleExport() }} />
            </div>
        </div>
    )
}