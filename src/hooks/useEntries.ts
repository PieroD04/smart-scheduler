import { useEffect, useState } from 'react';
import { ENTRIES, SELECTED_ENTRIES } from '../utils/constants';
import ScheduleEntry from '../models/ScheduleEntry';

export default function useEntries() {
    const [entries, setEntries] = useState<ScheduleEntry[]>([]);
    const [selectedEntries, setSelectedEntries] = useState<ScheduleEntry[]>([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(ENTRIES) || '[]');
        const formattedEntries = data.map((entry: ScheduleEntry) => ({
            ...entry,
            sessions: entry.sessions.map(session => ({
                ...session,
                start: new Date(session.start),
                end: new Date(session.end)
            }))
        }));
        setEntries(formattedEntries);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(SELECTED_ENTRIES) || '[]');
        const formattedEntries = data.map((entry: ScheduleEntry) => ({
            ...entry,
            sessions: entry.sessions.map(session => ({
                ...session,
                start: new Date(session.start),
                end: new Date(session.end)
            }))
        }));
        setSelectedEntries(formattedEntries);
    }, []);

    const updateSelectedEntries = (selectedEntries: ScheduleEntry[]) => {
        setSelectedEntries(selectedEntries);
        localStorage.setItem(SELECTED_ENTRIES, JSON.stringify(selectedEntries));
    }

    const getEntries = () => {
        const data = JSON.parse(localStorage.getItem(ENTRIES) || '[]');
        const formattedEntries = data.map((entry: ScheduleEntry) => ({
            ...entry,
            sessions: entry.sessions.map(session => ({
                ...session,
                start: new Date(session.start),
                end: new Date(session.end)
            }))
        }));
        setEntries(formattedEntries);
        return formattedEntries;
    };

    const deleteEntry = (index: number) => {
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
        localStorage.setItem(ENTRIES, JSON.stringify(updatedEntries));
    };

    return { entries, getEntries, setEntries, deleteEntry, selectedEntries, setSelectedEntries, updateSelectedEntries };
}