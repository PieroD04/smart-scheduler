import { useEffect, useState } from 'react';
import { SELECTED_ENTRIES } from '../utils/constants';
import ScheduleEntry from '../models/ScheduleEntry';

export default function useSelectedEntries() {
    const [selectedEntries, setSelectedEntries] = useState<ScheduleEntry[]>([]);

    useEffect(() => {
        getSelectedEntries();
    }, []);

    const getSelectedEntries = () => {
        const storedSelectedEntries = localStorage.getItem(SELECTED_ENTRIES);
        if (storedSelectedEntries) {
            setSelectedEntries(JSON.parse(storedSelectedEntries) as ScheduleEntry[]);
        }
    };

    const toggleSelectedEntry = (entry: ScheduleEntry) => {
        const isSelected = selectedEntries.some(sel => sel.id === entry.id);
        let newSelected;
        
        if (isSelected) {
            newSelected = selectedEntries.filter(sel => sel.id !== entry.id);
        } else {
            newSelected = [...selectedEntries, entry];
        }
        
        setSelectedEntries(newSelected);
        localStorage.setItem(SELECTED_ENTRIES, JSON.stringify(newSelected));
    };

    return { selectedEntries, getSelectedEntries, toggleSelectedEntry };
}
