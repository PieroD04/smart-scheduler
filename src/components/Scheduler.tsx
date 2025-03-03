import ScheduleEntry, { DayEnum } from "../models/ScheduleEntry";
import { format, differenceInMinutes, getHours, getMinutes } from "date-fns";
import "../styles/scheduler.css";

export default function Scheduler({ entries, selectedEntries }: { entries: ScheduleEntry[], selectedEntries: number[] }) {
    const days = [DayEnum.monday, DayEnum.tuesday, DayEnum.wednesday, DayEnum.thursday, DayEnum.friday, DayEnum.saturday, DayEnum.sunday];
    
    let minHour: number, maxHour: number;
    if (selectedEntries.length !== 0) {
        minHour = Math.min(...entries.flatMap(e => e.sessions.map(s => getHours(s.start))));
        maxHour = Math.max(...entries.flatMap(e => e.sessions.map(s => getHours(s.end))));
    }
    else {
        minHour = 8;
        maxHour = 18;
    }
    

    const hours = Array.from({ length: maxHour - minHour + 1 }, (_, i) =>
        `${String(i + minHour).padStart(2, '0')}:00`
    );

    const colors = ["bg-red-200", "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200", "bg-indigo-200"];

    const getPos = (day: DayEnum, start: Date, end: Date) => {
        const left = days.indexOf(day);
        const top = getHours(start) + getMinutes(start) / 60 - minHour;
        const height = differenceInMinutes(end, start) / 60;
        
        return { left, top, height };
    };

    return (
        <div className="scheduler-container overflow-auto">
            <div className="grid grid-cols-8 relative min-w-2xl">
                <div className="scheduler-cell bg-white font-medium">Hours</div>
                {
                    days.map((day, index) => (
                        <div className="scheduler-cell bg-white w-full font-medium" key={day}>{days[index]}</div>
                    ))
                }
                {
                    hours.map((hour) => [
                        <div className="scheduler-cell bg-white" key={hour}>{hour}</div>,
                        days.map((day) => (
                            <div key={`${day}-${hour}`} className="scheduler-cell bg-white" />
                        ))
                    ])
                }
                {
                    entries.map((entry) => (
                        selectedEntries.includes(entry.id) &&
                        entry.sessions.map((session, index) => {
                            const { left, top, height } = getPos(session.day, session.start, session.end);
                            const colorClass = colors[entry.id % colors.length];

                            return (
                                <div
                                    key={`${entry.course}-${index}`}
                                    className={`
                                        absolute w-1/8
                                        ${colorClass}
                                        scheduler-cell
                                        flex-col 
                                        overflow-hidden
                                        `
                                    }
                                    style={{
                                        left: `calc(${left + 1} * 12.5%)`,
                                        top: `calc(${(top + 1) * 75}px)`,
                                        height: `${height * 75}px`
                                    }}
                                >
                                    <p className="font-bold text-wrap text-xs lg:text-sm xl:text-base">{entry.course}</p>
                                    <p className="text-xs lg:text-sm xl:text-base">{entry.professor}</p>
                                    <p className="text-xs lg:text-sm xl:text-base">{entry.modality} ({format(session.start, "HH:mm")} - {format(session.end, "HH:mm")})</p>
                                </div>
                            );
                        })
                    ))
                }
            </div>
        </div>
    );
}