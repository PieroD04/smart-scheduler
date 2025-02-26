import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ScheduleEntry from "../models/ScheduleEntry";

export default function ProfessorList({ entries, getProffesors }: { entries: ScheduleEntry[], getProffesors: () => string[] }) {
    const [professors, setProfessors] = useState<string[]>([]);

    useEffect(() => {
        setProfessors(getProffesors());
    }, [entries]);

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

        setProfessors((prevProfessors) => {
            const oldIndex = prevProfessors.indexOf(active.id);
            const newIndex = prevProfessors.indexOf(over.id);
            return arrayMove(prevProfessors, oldIndex, newIndex);
        });
    };

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={professors} strategy={verticalListSortingStrategy}>
                    <List subheader={"Preferred professors"}>
                        {professors.map((professor) => (
                            <SortableItem key={professor} professor={professor} />
                        ))}
                    </List>
                </SortableContext>
            </DndContext>
        </>
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