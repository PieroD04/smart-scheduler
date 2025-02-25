import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns';
import ScheduleEntry from '../models/ScheduleEntry';
import useEntries from '../hooks/useEntries';

export default function ScheduleTable({ entries, deleteEntry }: { entries: ScheduleEntry[], deleteEntry: any }) {
    const [checked, setChecked] = useState<number[]>([]);
    const { selectedEntries, updateSelectedEntries } = useEntries();

    useEffect(() => {
        const selectedIndexs = entries
            .map((entry, index) => (selectedEntries.some(sel => sel.course === entry.course) ? index : -1))
            .filter(index => index !== -1);
        
        setChecked(selectedIndexs);
    }, [entries, selectedEntries]);

    const handleToggle = (index: number) => {
        setChecked(prev => {
            const newChecked = prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index];
            
            const updatedSelectedEntries = entries.filter((_, i) => newChecked.includes(i));
            updateSelectedEntries(updatedSelectedEntries);

            return newChecked;
        });
    };

    const handleDelete = (index: number) => {
        deleteEntry(index);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Select</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Professor</TableCell>
                        <TableCell>Modality</TableCell>
                        <TableCell>Sessions</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Checkbox
                                    checked={checked.includes(index)}
                                    onChange={() => handleToggle(index)}
                                />
                            </TableCell>
                            <TableCell>{entry.course}</TableCell>
                            <TableCell>{entry.professor}</TableCell>
                            <TableCell>{entry.modality}</TableCell>
                            <TableCell>
                                {entry.sessions.map((session, index) => (
                                    <div key={index}>
                                        {session.day} {format(session.start, 'HH:mm')} - {format(session.end, 'HH:mm')}
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleDelete(index)} aria-label="remove schedule">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}