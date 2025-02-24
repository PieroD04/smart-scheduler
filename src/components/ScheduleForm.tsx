import { useForm, SubmitHandler } from "react-hook-form"
import { DayEnum, ModalityEnum } from "../models/ScheduleEntry";
import { Session } from "../models/ScheduleEntry";
import { TextField, InputLabel, Select, MenuItem, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
interface FormInput {
    course: string;
    professor: string;
    modality: ModalityEnum;
    sessions: Session[];
}

export default function ScheduleForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormInput>()
    // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    //     name: "session", // unique name for your Field Array
    //   });
    const onSubmit: SubmitHandler<FormInput> = (data) => {
        console.log(data)
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
                    <div className="text-center font-medium text-lg">Session(s)</div>
                    <Button variant="text" startIcon={<AddIcon/>}>Add Session</Button> 
                </div>
                <div>
                    <div className="text-center font-semibold text-lg">Session {1}</div>
                    <div className="flex flex-col">
                        <InputLabel id="day-label">Day</InputLabel>
                        <Select
                            labelId="day-label"
                            id="day"
                            label="Day"
                            defaultValue={DayEnum.monday}
                        >
                            <MenuItem value={DayEnum.monday}>Monday</MenuItem>
                            <MenuItem value={DayEnum.tuesday}>Tuesday</MenuItem>
                            <MenuItem value={DayEnum.wednesday}>Wednesday</MenuItem>
                            <MenuItem value={DayEnum.thursday}>Thursday</MenuItem>
                            <MenuItem value={DayEnum.friday}>Friday</MenuItem>
                            <MenuItem value={DayEnum.saturday}>Saturday</MenuItem>
                            <MenuItem value={DayEnum.sunday}>Sunday</MenuItem>
                        </Select>
                    </div>
                    <div className="flex flex-row gap-2">
                        <TextField
                            id="start"
                            label="Start"
                            variant="outlined"
                        />
                        <TextField
                            id="end"
                            label="End"
                            variant="outlined"
                        />
                    </div>
                </div>
                <Button
                    className="w-1/2 self-center"
                    variant="contained"
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </Paper>

    )
}