import ScheduleEntry, { DayEnum } from "../models/ScheduleEntry";
import { differenceInMinutes, getHours, getMinutes } from "date-fns";
const days = [DayEnum.monday, DayEnum.tuesday, DayEnum.wednesday, DayEnum.thursday, DayEnum.friday, DayEnum.saturday, DayEnum.sunday];
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export default function Scheduler({ entries = [] }: { entries: ScheduleEntry[] }) {
    return (
        <div className="overflow-auto">
            <div className="grid grid-cols-8 relative min-w-4xl">
                <div className="border border-gray-300 p-2 text-center font-medium">Hours</div>
                {
                    days.map((day, index) => (
                        <div className="border border-gray-300 p-2 w-full text-center font-medium" key={day}>{days[index]}</div>
                    ))
                }
                {
                    hours.map((hour) => [
                        <div className="border border-gray-300 p-2 text-center" key={hour}>{hour}</div>,
                        days.map((day) => (
                            <div key={`${day}-${hour}`} className="border border-gray-300" />
                        ))
                    ])
                }
                {
                entries.map((entry) => (
                    entry.sessions.map((session, sessionIndex) => {
                        const { dayIndex, startHourIndex, startTopOffset } = getPos(session.day, session.start);
                        return (
                            <div
                                key={`${entry.course}-${sessionIndex}`}
                                className="absolute bg-blue-200 border border-gray-300 text-center p-1"
                                style={{
                                    width: "12.5%",
                                    left: `calc(${dayIndex + 1} * 12.5%)`,
                                    top: `calc(${(startHourIndex + 1) * 42}px + ${startTopOffset}%)`,
                                    height: `calc(${differenceInMinutes(session.end, session.start) / 60} * 42px)`,
                                }}
                            >
                                {entry.course}
                            </div>
                        );
                    })
                ))
            }
            </div>
        </div>

    );
}

function getPos(day: DayEnum, start: Date) {
    const dayIndex = days.indexOf(day);
    const startHourIndex = getHours(start);
    const startMinutes = getMinutes(start);
    const startTopOffset = (startMinutes / 60) * 100;

    console.log({ dayIndex, startHourIndex, startTopOffset });
    return { dayIndex, startHourIndex, startTopOffset };
}