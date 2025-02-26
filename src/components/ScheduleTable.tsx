import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, IconButton, Paper } from '@mui/material';
import ScheduleEntry from '../models/ScheduleEntry';

export default function ScheduleTable({entries, selectedEntries, toggleSelectedEntry, deleteEntry}:
     {entries: ScheduleEntry[], selectedEntries: ScheduleEntry[], toggleSelectedEntry: (entry: ScheduleEntry) => void, deleteEntry: (index: number) => void}) {
    
    const handleToggle = (entry: ScheduleEntry) => {
        toggleSelectedEntry(entry);
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
                                    checked={selectedEntries.some(sel => sel.id === entry.id)}
                                    onChange={() => handleToggle(entry)}
                                />
                            </TableCell>
                            <TableCell>{entry.course}</TableCell>
                            <TableCell>{entry.professor}</TableCell>
                            <TableCell>{entry.modality}</TableCell>
                            <TableCell>
                                {entry.sessions.map((session, sessionIndex) => (
                                    <div key={sessionIndex}>
                                        {session.day} {format(session.start, 'HH:mm')} - {format(session.end, 'HH:mm')}
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleDelete(entry.id)} aria-label="remove schedule">
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