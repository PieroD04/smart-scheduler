import { TimeField } from "@mui/x-date-pickers";
import { TimeRange } from "../models/Preferences";
import { useState } from "react";
import { isBefore } from "date-fns";

export default function TimeRangeSelector({ timeRange, setTimeRange }: { timeRange: TimeRange, setTimeRange: (timeRange: TimeRange) => void }) {
    const [error, setError] = useState<string | null>(null);

    const handleStartChange = (start: Date | null) => {
        if (start) {
            if (timeRange.end && !isBefore(start, timeRange.end)) {
                setError("Start time must be before end time");
            } else {
                setError(null);
                setTimeRange({ ...timeRange, start });
            }
        }
    };

    const handleEndChange = (end: Date | null) => {
        if (end) {
            if (timeRange.start && !isBefore(timeRange.start, end)) {
                setError("End time must be after start time");
            } else {
                setError(null);
                setTimeRange({ ...timeRange, end });
            }
        }
    };
    
    return (
        <div>
            <div className="font-semibold text-lg text-center">Preferred time range</div>
            <div className="font-light text-sm text-center mb-2">Select the time range you would like to have your classes in.</div>
            <form className="flex flex-row gap-2">
                <TimeField
                    label="Start"
                    color={error ? "error" : "primary"}
                    value={timeRange.start}
                    onChange={handleStartChange}
                />
                <div className="flex items-center">-</div>
                <TimeField
                    label="End"
                    color={error ? "error" : "primary"}
                    value={timeRange.end}
                    onChange={handleEndChange}
                />
            </form>
            <div className="text-red-500 text-xs p-1">{error}</div>                    
        </div>
    );
}