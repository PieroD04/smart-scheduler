import { useEffect, useState } from 'react';
import { SELECTED_ENTRIES } from '../utils/constants';
import ScheduleEntry from '../models/ScheduleEntry';

export default function useSelectedEntries() {
    const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

    useEffect(() => {
        fetchSelectedEntries();
    }, []);

    const fetchSelectedEntries = () => {
        const storedSelectedEntries = localStorage.getItem(SELECTED_ENTRIES);
        if (storedSelectedEntries) {
            setSelectedEntries(JSON.parse(storedSelectedEntries));
        }
    };

    const updateSelectedEntries = (entries: ScheduleEntry[]) => {
        const ids = entries.map(entry => entry.id);
        setSelectedEntries(ids);
        localStorage.setItem(SELECTED_ENTRIES, JSON.stringify(ids));
    };

    const toggleSelectedEntry = (entry: ScheduleEntry) => {
        const isSelected = selectedEntries.some(sel => sel === entry.id);
        let newSelected;
        
        if (isSelected) {
            newSelected = selectedEntries.filter(sel => sel !== entry.id);
        } else {
            newSelected = [...selectedEntries, entry.id];
        }
        
        setSelectedEntries(newSelected);
        localStorage.setItem(SELECTED_ENTRIES, JSON.stringify(newSelected));
    };

    return { selectedEntries, updateSelectedEntries, toggleSelectedEntry };
}
