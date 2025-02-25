import ScheduleEntry, { DayEnum } from "../models/ScheduleEntry";
import { format, differenceInMinutes, getHours, getMinutes } from "date-fns";
import "../styles/scheduler.css";
import useEntries from "../hooks/useEntries";
import { useEffect, useState } from "react";
const days = [DayEnum.monday, DayEnum.tuesday, DayEnum.wednesday, DayEnum.thursday, DayEnum.friday, DayEnum.saturday, DayEnum.sunday];
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const colors = ["bg-red-200", "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200", "bg-indigo-200"];

export default function Scheduler() {
    const { selectedEntries } = useEntries();
    const [entries, setEntries] = useState<ScheduleEntry[]>(selectedEntries);

    useEffect(() => {
        setEntries(selectedEntries);
    }, [selectedEntries]);

    return (
        <div className="overflow-auto">
            <div className="grid grid-cols-8 relative min-w-2xl">
                <div className="scheduler-cell font-medium">Hours</div>
                {
                    days.map((day, index) => (
                        <div className="scheduler-cell w-full font-medium" key={day}>{days[index]}</div>
                    ))
                }
                {
                    hours.map((hour) => [
                        <div className="scheduler-cell" key={hour}>{hour}</div>,
                        days.map((day) => (
                            <div key={`${day}-${hour}`} className="scheduler-cell" />
                        ))
                    ])
                }
                {
                    entries.map((entry, index) => (
                        entry.sessions.map((session, sessionIndex) => {
                            const { left, top, height } = getPos(session.day, session.start, session.end);
                            const colorClass = colors[index % colors.length];
                            
                            return (
                                <div
                                    key={`${entry.course}-${sessionIndex}`}
                                    className={`
                                        absolute w-1/8
                                        ${colorClass}
                                        scheduler-cell
                                        flex-col overflow-y-hidden`
                                    }
                                    style={{
                                        left: `calc(${left + 1} * 12.5%)`,
                                        top: `calc(${(top + 1) * 75}px)`,
                                        height: `${height * 75}px`
                                    }}
                                >
                                    <p className="font-bold text-sm">{entry.course}</p>
                                    <p className="text-xs">{entry.professor}</p>
                                    <p className="text-xs">{entry.modality} ({format(session.start, "HH:mm")} - {format(session.end, "HH:mm")})</p>
                                </div>
                            );
                        })
                    ))
                }
            </div>
        </div>

    );
}

function getPos(day: DayEnum, start: Date, end: Date) {
    const left = days.indexOf(day);
    const top = getHours(start) + getMinutes(start) / 60;
    const height = differenceInMinutes(end, start) / 60;

    return { left, top, height };
}