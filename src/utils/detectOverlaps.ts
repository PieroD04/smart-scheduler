import { isBefore, isAfter, getHours, getMinutes, setHours, setMinutes, parseISO } from 'date-fns';
import ScheduleEntry, { Session } from '../models/ScheduleEntry';
import Overlap from '../models/Overlap';

export default function detectOverlaps(entries: ScheduleEntry[]): Overlap[] {
    const overlaps: Overlap[] = [];

    for (let i = 0; i < entries.length; i++) {
        const entryA = entries[i];

        for (let j = i + 1; j < entries.length; j++) {
            const entryB = entries[j];

            for (const sessionA of entryA.sessions) {
                for (const sessionB of entryB.sessions) {
                    if (areSessionsOverlapping(sessionA, sessionB)) {
                        const overlap = calculateExactOverlap(sessionA, sessionB);
                        overlaps.push({
                            course1: entryA.course,
                            course2: entryB.course,
                            day: sessionA.day,
                            start: overlap.start,
                            end: overlap.end
                        });
                    }
                }
            }
        }
    }

    return overlaps;
}

function areSessionsOverlapping(sessionA: Session, sessionB: Session): boolean {
    if (sessionA.day !== sessionB.day) return false;

    const aStart = parseISO(sessionA.start.toString());
    const aEnd = parseISO(sessionA.end.toString());
    const bStart = parseISO(sessionB.start.toString());
    const bEnd = parseISO(sessionB.end.toString());

    const baseDate = new Date(2000, 0, 1);
    const aStartTime = setMinutes(setHours(baseDate, getHours(aStart)), getMinutes(aStart));
    const aEndTime = setMinutes(setHours(baseDate, getHours(aEnd)), getMinutes(aEnd));
    const bStartTime = setMinutes(setHours(baseDate, getHours(bStart)), getMinutes(bStart));
    const bEndTime = setMinutes(setHours(baseDate, getHours(bEnd)), getMinutes(bEnd));

    return (
        (isBefore(aStartTime, bEndTime) && isAfter(aEndTime, bStartTime)) ||
        (isBefore(aStartTime, bStartTime) && isAfter(aEndTime, bEndTime)) ||
        (isBefore(bStartTime, aStartTime) && isAfter(bEndTime, aEndTime))
    );
}

function calculateExactOverlap(sessionA: Session, sessionB: Session): { start: Date; end: Date } {
    const aStart = parseISO(sessionA.start.toString());
    const aEnd = parseISO(sessionA.end.toString());
    const bStart = parseISO(sessionB.start.toString());
    const bEnd = parseISO(sessionB.end.toString());

    const overlapStart = isBefore(aStart, bStart) ? bStart : aStart;
    const overlapEnd = isBefore(aEnd, bEnd) ? aEnd : bEnd;

    return {
        start: new Date(overlapStart),
        end: new Date(overlapEnd)
    };
}