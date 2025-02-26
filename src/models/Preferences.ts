export default interface Preferences {
    professors: string[];
    time_range: TimeRange;
}

export interface TimeRange {
    start: Date;
    end: Date;
}