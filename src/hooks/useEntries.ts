import { useEffect, useState } from 'react';
import { ENTRIES } from '../utils/constants';
import ScheduleEntry from '../models/ScheduleEntry';

export default function useEntries() {
    const [entries, setEntries] = useState<ScheduleEntry[]>([]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = () => {
        const storedEntries = localStorage.getItem(ENTRIES);
        if (storedEntries) {
            setEntries(JSON.parse(storedEntries) as ScheduleEntry[]);
        }
    };

    const addEntry = (entry: ScheduleEntry) => {
        const newId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;
        const newEntry = { ...entry, id: newId };
        const newEntries = [...entries, newEntry];
        setEntries(newEntries);
        localStorage.setItem(ENTRIES, JSON.stringify(newEntries));
    };


    const deleteEntry = (id: number) => {
        const newEntries = entries.filter(e => e.id !== id);
        setEntries(newEntries);
        localStorage.setItem(ENTRIES, JSON.stringify(newEntries));

    };

    return { entries, addEntry, deleteEntry };
}