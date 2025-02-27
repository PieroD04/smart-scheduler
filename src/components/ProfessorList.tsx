import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export default function ProfessorList({ professors, setProfessors }: { professors: string[], setProfessors: (professors: string[]) => void }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 5,
            },
        })
    );

    const onDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const newProfessors = arrayMove(professors, professors.indexOf(active.id), professors.indexOf(over.id));
        setProfessors(newProfessors);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={professors} strategy={verticalListSortingStrategy}>
                <List>
                    <div className="font-semibold text-lg text-center">Preferred professors</div>
                    <div className="font-light text-sm text-center mb-2">Order the professors by preference.</div>
                    {
                        professors.length === 0 ? (
                            <p className="text-center text-sm">No professors available</p>
                        ) : (
                            professors.map((professor) => (
                                <SortableItem key={professor} professor={professor} />
                            ))
                        )
                    }
                </List>
            </SortableContext>
        </DndContext>
    );
}

const SortableItem = ({ professor }: { professor: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: professor });

    const style = {
        transform: CSS.Transform.toString(transform && { ...transform, x: 0 }),
        transition,
        touchAction: 'none',
    };

    return (
        <ListItem className="border border-gray-300 rounded-md" ref={setNodeRef} style={style}>
            <ListItemText primary={professor} />
            <IconButton {...attributes} {...listeners} className="touch-action-none">
                <DragIndicatorIcon />
            </IconButton>
        </ListItem>
    );
};