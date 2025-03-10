import { useForm, SubmitHandler, useFieldArray, Controller, FieldErrors, Control, UseFormClearErrors } from "react-hook-form";
import ScheduleEntry, { DayEnum, ModalityEnum } from "../models/ScheduleEntry";
import { Session } from "../models/ScheduleEntry";
import { TextField, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { TimeField } from '@mui/x-date-pickers/TimeField';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { isBefore, isAfter, isEqual } from "date-fns";

function areOverlapping(sessions: Session[]) {
    return sessions.some((sessionA, indexA) =>
        sessions.some((sessionB, indexB) =>
            sessionA.day === sessionB.day &&
            indexA !== indexB &&
            isBefore(sessionA.start, sessionB.end) &&
            isAfter(sessionA.end, sessionB.start)
        )
    );
}

export default function ScheduleForm({ entry, addEntry, updateEntry, handleDialogClose }: { entry: ScheduleEntry | null, addEntry: (entry: ScheduleEntry) => void, updateEntry: (entry: ScheduleEntry) => void, handleDialogClose: () => void }) {
    const { control, register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<ScheduleEntry>({
        defaultValues: {
            course: entry?.course || "",
            professor: entry?.professor || "",
            modality: entry?.modality || ModalityEnum.inPerson,
            sessions: entry?.sessions
                ? entry.sessions.map(session => ({ day: session.day, start: new Date(session.start), end: new Date(session.end)}))
                : [{ day: DayEnum.monday, start: new Date(new Date().setHours(8, 0)), end: new Date(new Date().setHours(9, 0)) } as Session]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sessions"
    });

    const onSubmit: SubmitHandler<ScheduleEntry> = (data) => {
        clearErrors("sessions");
        if (data.sessions.length === 0) {
            setError("sessions", { type: "manual", message: "At least one session is required." });
            return;
        }

        if (areOverlapping(data.sessions)) {
            setError("sessions", { type: "manual", message: "Sessions cannot overlap." });
            return;
        }
        
        if (entry) updateEntry({ ...data, id: entry.id });
        else addEntry(data);

        handleDialogClose();
        alert("Schedule submitted successfully!");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-2">
            <TextField
                id="course"
                label="Course"
                variant="outlined"
                error={errors.course ? true : false}
                helperText={errors.course ? "Course is required" : ""}
                {...register("course", { required: true })}
            />
            <TextField
                id="professor"
                label="Professor"
                variant="outlined"
                error={errors.professor ? true : false}
                helperText={errors.professor ? "Professor is required" : ""}
                {...register("professor", { required: true })}
            />
            <div className="flex flex-col">
                <InputLabel id="modality-label">Modality</InputLabel>
                <Select
                    labelId="modality-label"
                    id="modality"
                    label="Modality"
                    defaultValue={ModalityEnum.inPerson}
                    {...register("modality", { required: true })}
                >
                    <MenuItem value={ModalityEnum.inPerson}>In Person</MenuItem>
                    <MenuItem value={ModalityEnum.virtual}>Virtual</MenuItem>
                    <MenuItem value={ModalityEnum.hybrid}>Hybrid</MenuItem>
                </Select>
            </div>
            <div className="flex flex-row justify-between items-center">
                <div className="text-center font-semibold text-lg">Session(s)</div>
                <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        append({ day: DayEnum.monday, start: new Date(new Date().setHours(8, 0)), end: new Date(new Date().setHours(9, 0)) });
                        clearErrors("sessions")
                    }}
                >Add</Button>
            </div>
            {
                fields.map((field, index) => {
                    return (
                        <SessionForm
                            key={field.id}
                            id={index}
                            onRemove={(id) => { remove(id) }}
                            control={control}
                            errors={errors}
                            clearErrors={clearErrors}
                        />
                    )
                })
            }
            <Button
                className="w-1/2 self-center"
                variant="contained"
                type="submit"
            >
                Submit
            </Button>
            <div className="text-red-500 text-sm p-1 text-center">
                {errors.sessions?.message}
            </div>
        </form>
    )
}

function SessionForm({ id, onRemove, control, errors, clearErrors }:
    { id: number, onRemove: (id: number) => void, control: Control<ScheduleEntry, undefined>, errors: FieldErrors<ScheduleEntry>, clearErrors: UseFormClearErrors<ScheduleEntry> }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
                <p className="text-center font-medium text-lg">Session {id + 1}</p>
                <Button
                    variant="text"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => { onRemove(id) }}
                >Remove</Button>
            </div>
            <div className="flex flex-col">
                <InputLabel id="day-label">Day</InputLabel>
                <Controller
                    name={`sessions.${id}.day`}
                    control={control}
                    render={({ field }) => (
                        <Select
                            labelId="day-label"
                            id="day"
                            label="Day"
                            {...field}
                        >
                            <MenuItem value={DayEnum.monday}>Monday</MenuItem>
                            <MenuItem value={DayEnum.tuesday}>Tuesday</MenuItem>
                            <MenuItem value={DayEnum.wednesday}>Wednesday</MenuItem>
                            <MenuItem value={DayEnum.thursday}>Thursday</MenuItem>
                            <MenuItem value={DayEnum.friday}>Friday</MenuItem>
                            <MenuItem value={DayEnum.saturday}>Saturday</MenuItem>
                            <MenuItem value={DayEnum.sunday}>Sunday</MenuItem>
                        </Select>
                    )
                    }
                />
            </div>
            <div className="mb-2">
                <InputLabel id="time-label">Time Range</InputLabel>
                <div className="flex flex-row gap-2">
                    <Controller
                        name={`sessions.${id}.start`}
                        control={control}
                        render={({ field }) => (
                            <TimeField
                                color={errors.sessions?.[id]?.end ? "error" : "primary"}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    clearErrors("sessions");
                                }}
                            />
                        )}
                    />
                    <div className="flex items-center">-</div>
                    <Controller
                        name={`sessions.${id}.end`}
                        control={control}
                        rules={{
                            validate: (value, formValues) => {
                                const startValue = formValues.sessions[id].start;
                                if (isEqual(startValue, value)) {
                                    return "Start and end time cannot be the same.";
                                }
                                if (isAfter(startValue, value)) {
                                    return "End time must be after start time.";
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <TimeField
                                color={errors.sessions?.[id]?.end ? "error" : "primary"}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    clearErrors("sessions");
                                }}
                            />
                        )}
                    />
                </div>
                <p className="text-red-500 text-xs p-1">
                    {errors.sessions?.[id]?.end?.message}
                </p>
            </div>

        </div>
    )
}