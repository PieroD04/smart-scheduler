import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, IconButton } from '@mui/material';
import ScheduleEntry, { Session } from '../models/ScheduleEntry';

const columns: GridColDef[] = [
    {
        field: 'select',
        headerName: 'Select',
        width: 75,
        renderCell: (params) => (
            <Checkbox
                checked={params.row.selected}
                onChange={() => params.row.toggleSelectedEntry(params.row)}
            />
        )
    },
    { field: 'course', headerName: 'Course', width: 300 },
    { field: 'professor', headerName: 'Professor', width: 150 },
    { field: 'modality', headerName: 'Modality', width: 120 },
    {
        field: 'sessions',
        headerName: 'Sessions',
        width: 500,
        renderCell: (params) => (
            <div>
                {params.value.map((session: Session, index: number) => (
                    <div key={index}>
                        {session.day} {format(session.start, 'HH:mm')} - {format(session.end, 'HH:mm')}
                    </div>
                ))}
            </div>
        )
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        renderCell: (params) => (
            <>
                <IconButton onClick={() => params.row.updateEntry(params.row.id)} aria-label="edit schedule">
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => params.row.deleteEntry(params.row.id)} aria-label="remove schedule">
                    <DeleteIcon />
                </IconButton>
            </>

        )
    }
];

export default function ScheduleTable({ entries, selectedEntries, toggleSelectedEntry, updateEntry, deleteEntry }:
    { entries: ScheduleEntry[], selectedEntries: number[], toggleSelectedEntry: (entry: ScheduleEntry) => void, updateEntry: (id: number) => void, deleteEntry: (id: number) => void }) {
    const paginationModel = { page: 0, pageSize: 5 };

    const rows = entries.map((entry, index) => ({
        ...entry,
        id: entry.id || index,
        selected: selectedEntries.some(sel => sel === entry.id),
        toggleSelectedEntry,
        updateEntry,
        deleteEntry
    }));

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 15, 20]}
            pagination
            disableColumnSorting
            disableColumnMenu
            disableAutosize
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
            sx={{
                "& .MuiDataGrid-cell": {
                    display: "flex",
                    alignItems: "center",
                    padding: "5px"
                }
            }}
        />
    );
}
