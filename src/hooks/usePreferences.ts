import { useEffect, useState } from "react";
import { PREFERENCES } from "../utils/constants";
import Preferences, { TimeRange } from "../models/Preferences";
import ScheduleEntry from "../models/ScheduleEntry";
import { setHours, setMinutes, setSeconds } from "date-fns";

export default function usePreferences({ entries }: { entries: ScheduleEntry[] }) {
    const [professors, setProfessors] = useState<string[]>([]);
    const [timeRange, setTimeRange] = useState<TimeRange>({ start: new Date(), end: new Date() });

    useEffect(() => {
        updateProfessors(entries);
    }, [entries]);

    useEffect(() => {
        const preferences = JSON.parse(localStorage.getItem(PREFERENCES) || '{}') as Preferences;
        const defaultTime = (hours: number) => setSeconds(setMinutes(setHours(new Date(), hours), 0), 0);

        if (!preferences.time_range) {
            preferences.time_range = { start: defaultTime(9), end: defaultTime(13) };
            localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
        }

        setTimeRange({
            start: new Date(preferences.time_range.start),
            end: new Date(preferences.time_range.end),
        });
    }, []);

    const updateProfessors = (entries: ScheduleEntry[]) => {
        const preferences = JSON.parse(localStorage.getItem(PREFERENCES) || '{}') as Preferences;
        const professorSet = new Set<string>(entries.map(entry => entry.professor));
        let professors = Array.from(professorSet);

        if (preferences.professors) {
            professors = [
                ...preferences.professors.filter(professor => professorSet.has(professor)),
                ...professors.filter(professor => !preferences.professors.includes(professor))
            ];
        }
        setProfessors(professors);
    }

    const updateTimeRange = (timeRange: TimeRange) => {
        const preferences = JSON.parse(localStorage.getItem(PREFERENCES) || '{}');
        preferences.time_range = timeRange;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
        setTimeRange(timeRange);
    }

    const updateProfessorOrder = (professors: string[]) => {
        const preferences = JSON.parse(localStorage.getItem(PREFERENCES) || '{}');
        preferences.professors = professors;
        localStorage.setItem(PREFERENCES, JSON.stringify(preferences));
        setProfessors(professors);
    }

    return { professors, updateProfessorOrder, timeRange, updateTimeRange };
}
