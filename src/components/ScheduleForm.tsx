import { useForm, SubmitHandler, useFieldArray, Controller, FieldErrors, Control, UseFormClearErrors } from "react-hook-form"
import ScheduleEntry, { DayEnum, ModalityEnum } from "../models/ScheduleEntry";
import { Session } from "../models/ScheduleEntry";
import { TextField, InputLabel, Select, MenuItem, Button, Paper } from "@mui/material";
import { TimeField } from '@mui/x-date-pickers/TimeField';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

interface FormInput {
    course: string;
    professor: string;
    modality: ModalityEnum;
    sessions: Session[];
}

function areOverlapping(sessions: Session[]) {
    return sessions.some((sessionA, indexA) =>
        sessions.some((sessionB, indexB) =>
            sessionA.day === sessionB.day &&
            indexA !== indexB &&
            dayjs(sessionA.start).isBefore(dayjs(sessionB.end)) &&
            dayjs(sessionA.end).isAfter(dayjs(sessionB.start))
        )
    );
}


export default function ScheduleForm() {
    const { control, register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<FormInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sessions"
    });
    const onSubmit: SubmitHandler<FormInput> = (data) => {
        clearErrors("sessions");
        if (data.sessions.length === 0) {
            setError("sessions", { type: "manual", message: "At least one session is required." });
            return;
        }

        if (areOverlapping(data.sessions)) {
            setError("sessions", { type: "manual", message: "Sessions cannot overlap." });
            return;
        }

        localStorage.setItem("schedules", JSON.stringify([...JSON.parse(localStorage.getItem("schedules") || "[]"), data as ScheduleEntry]));
        localStorage.setItem("courses", JSON.stringify([...JSON.parse(localStorage.getItem("courses") || "[]"), data.course]));
        localStorage.setItem("professors", JSON.stringify([...JSON.parse(localStorage.getItem("professors") || "[]"), data.professor]));
        alert("Schedule submitted successfully!");
    }

    return (
        <Paper elevation={3} className="p-4">
            <div className="text-center font-semibold text-xl">Schedule Form</div>
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
                            append({ day: DayEnum.monday, start: dayjs().hour(8).minute(0), end: dayjs().hour(9).minute(0) } as Session)
                            clearErrors("sessions")
                        }}
                    >Add Session</Button>
                </div>
                {
                    fields.map((field, index) => {
                        return (
                            <SessionForm
                                key={field.id}
                                id={index.toString()}
                                onRemove={(id) => { remove(parseInt(id)) }}
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
        </Paper>

    )
}

function SessionForm({ id, onRemove, control, errors, clearErrors }: { id: string, onRemove: (id: string) => void, control: Control<FormInput, any>, errors: FieldErrors<FormInput>, clearErrors: UseFormClearErrors<FormInput> }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
                <div className="text-center font-medium text-lg">Session {parseInt(id) + 1}</div>
                <Button
                    variant="text"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => { onRemove(id) }}
                >Remove Session</Button>
            </div>
            <div className="flex flex-col">
                <InputLabel id="day-label">Day</InputLabel>
                <Controller
                    name={`sessions.${parseInt(id)}.day`}
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
                        name={`sessions.${parseInt(id)}.start`}
                        control={control}
                        render={({ field }) => (
                            <TimeField
                                color={errors.sessions?.[parseInt(id)]?.end ? "error" : "primary"}
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
                        name={`sessions.${parseInt(id)}.end`}
                        control={control}
                        rules={{
                            validate: (value, formValues) => {
                                const startValue = formValues.sessions[parseInt(id)].start;
                                if (dayjs(startValue).isSame(value)) {
                                    return "Start and end time cannot be the same.";
                                }
                                if (dayjs(startValue).isAfter(value)) {
                                    return "End time must be after start time.";
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <TimeField
                                color={errors.sessions?.[parseInt(id)]?.end ? "error" : "primary"}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    clearErrors("sessions");
                                }}
                            />
                        )}
                    />
                </div>
                <div className="text-red-500 text-xs p-1">
                    {errors.sessions?.[parseInt(id)]?.end?.message}
                </div>
            </div>

        </div>
    )
}

