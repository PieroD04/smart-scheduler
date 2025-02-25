import { useEffect, useState } from 'react';
import { ENTRIES, SELECTED_ENTRIES } from '../utils/constants';
import ScheduleEntry from '../models/ScheduleEntry';

export default function useEntries() {
    const [entries, setEntries] = useState<ScheduleEntry[]>([]);
    const [selectedEntries, setSelectedEntries] = useState<ScheduleEntry[]>([]);

    const parseEntriesFromStorage = (key: string): ScheduleEntry[] => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        return data.map((entry: ScheduleEntry) => ({
            ...entry,
            sessions: entry.sessions.map(session => ({
                ...session,
                start: new Date(session.start),
                end: new Date(session.end),
            })),
        }));
    };

    useEffect(() => {
        setEntries(parseEntriesFromStorage(ENTRIES));
        setSelectedEntries(parseEntriesFromStorage(SELECTED_ENTRIES));
    }, []);

    const updateSelectedEntries = (newSelectedEntries: ScheduleEntry[]) => {
        setSelectedEntries(newSelectedEntries);
        localStorage.setItem(SELECTED_ENTRIES, JSON.stringify(newSelectedEntries));
    };

    const getEntries = (): ScheduleEntry[] => {
        return parseEntriesFromStorage(ENTRIES);
    };

    const getSelectedEntries = (): ScheduleEntry[] => {
        return parseEntriesFromStorage(SELECTED_ENTRIES);
    };

    const deleteEntry = (id: number) => {
        const updatedEntries = entries.filter((_, i) => i !== id);
        setEntries(updatedEntries);
        localStorage.setItem(ENTRIES, JSON.stringify(updatedEntries));
    };

    return { entries, getEntries, setEntries, deleteEntry, selectedEntries, getSelectedEntries, setSelectedEntries, updateSelectedEntries };
}