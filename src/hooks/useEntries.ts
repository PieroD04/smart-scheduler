import { useEffect, useState } from 'react';
import { ENTRIES } from '../utils/constants';
import ScheduleEntry from '../models/ScheduleEntry';

export default function useEntries() {
    const [entries, setEntries] = useState<ScheduleEntry[]>([]);

    useEffect(() => {
        getEntries();
    }, []);

    const addEntry = (entry: ScheduleEntry) => {
        const newEntries = [...entries, entry];
        setEntries(newEntries);
        localStorage.setItem(ENTRIES, JSON.stringify(newEntries));
    };

    const getEntries = () => {
        const storedEntries = localStorage.getItem(ENTRIES);
        if (storedEntries) {
            setEntries(JSON.parse(storedEntries) as ScheduleEntry[]);
        }
    };

    const deleteEntry = (index: number) => {
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
        localStorage.setItem(ENTRIES, JSON.stringify(newEntries));

    };

    return { entries, addEntry, getEntries, deleteEntry };
}