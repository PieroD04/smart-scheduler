export default interface ScheduleEntry {
    id: number;
    course: string;
    professor: string;
    modality: ModalityEnum;
    sessions: Session[];
}

export enum ModalityEnum {
    virtual = "Virtual",
    inPerson = "In Person",
    hybrid = "Hybrid"
}

export interface Session {
    day: DayEnum;
    start: Date;
    end: Date;
}

export enum DayEnum {
    monday = "Monday",
    tuesday = "Tuesday",
    wednesday = "Wednesday",
    thursday = "Thursday",
    friday = "Friday",
    saturday = "Saturday",
    sunday = "Sunday"
}

