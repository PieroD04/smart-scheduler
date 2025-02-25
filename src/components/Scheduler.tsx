import { format } from "date-fns";
import ScheduleEntry, { DayEnum } from "../models/ScheduleEntry";

const days = [DayEnum.monday, DayEnum.tuesday, DayEnum.wednesday, DayEnum.thursday, DayEnum.friday, DayEnum.saturday, DayEnum.sunday];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function Scheduler({ entries = [] }: { entries: ScheduleEntry[] }) {
    return (
        <div className="grid grid-cols-8 border border-gray-300 relative">
            <div className="border border-gray-300 p-2 text-center font-bold">Horas</div>
            {days.map((day) => (
                <div key={day} className="border border-gray-300 p-2 text-center font-bold">
                    {day}
                </div>
            ))}

            {hours.flatMap((hour) => [
                <div key={`hour-${hour}`} className="border border-gray-300 p-2 text-center">
                    {format(new Date(0, 0, 0, hour), "HH:mm")}
                </div>,
                days.map((day) => (
                    <div key={`${day}-${hour}`} className="border border-gray-300 h-12 relative" />
                ))
            ])}
        </div>
    );
}

