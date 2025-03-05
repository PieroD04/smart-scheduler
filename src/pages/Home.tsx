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
import domtoimage from "dom-to-image";
import Footer from "../components/Footer";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null);
    const { entries, addEntry, updateEntry, deleteEntry } = useEntries();
    const { selectedEntries, updateSelectedEntries, toggleSelectedEntry } = useSelectedEntries();
    const { professors, updateProfessorOrder, timeRange, updateTimeRange } = usePreferences({ entries });

    const handleClickOpen = (id: number | null = null) => {
        if (id) setSelectedEntry(entries.find(entry => entry.id === id) || null);
        else setSelectedEntry(null);
        setOpen(true);
    };

    const handleOptimize = () => {
        const optimizedEntries = optimizeSchedule(entries, professors, timeRange);
        updateSelectedEntries(optimizedEntries);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleExport = async () => {
        const element = document.querySelector(".scheduler-container") as HTMLElement;
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
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="w-full bg-blue-500 text-white text-center py-6 shadow-md">
                <h1 className="text-4xl font-bold">Smart Scheduler</h1>
                <p className="text-lg font-light mt-1">Optimize your schedule with ease</p>
            </header>
            <main className="w-full max-w-7xl p-2 md:p-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <ScheduleTable 
                        entries={entries} 
                        selectedEntries={selectedEntries} 
                        toggleSelectedEntry={toggleSelectedEntry} 
                        updateEntry={(id: number) => handleClickOpen(id)} 
                        deleteEntry={deleteEntry} 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <ProffesorList professors={professors} setProfessors={updateProfessorOrder} />
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 flex justify-center">
                        <TimeRangeSelector timeRange={timeRange} setTimeRange={updateTimeRange} />
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <Scheduler entries={entries} selectedEntries={selectedEntries} />
                </div>
            </main>
            <Footer />
            {/* Dialog and SpeedDial Components that dont affect the main layout */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-semibold">Schedule Form</p>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <ScheduleForm entry={selectedEntry} addEntry={addEntry} updateEntry={updateEntry} handleDialogClose={handleClose} />
                </DialogContent>
            </Dialog>
            <div className="fixed bottom-5 right-5">
                <SpeedDial handleAdd={handleClickOpen} handleOptimize={handleOptimize} handleExport={handleExport} />
            </div>
        </div>
    );
}