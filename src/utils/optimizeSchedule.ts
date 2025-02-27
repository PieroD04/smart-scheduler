import { isBefore, isAfter, getHours } from 'date-fns';
import { TimeRange } from "../models/Preferences";
import ScheduleEntry, { Session } from "../models/ScheduleEntry";

export default function optimizeSchedule(entries: ScheduleEntry[], professors: string[], preferredTimeRange: TimeRange): ScheduleEntry[] {
    // This function returns a new array of ScheduleEntry objects that are optimized based on the following criteria:
    // 1. No two entries should overlap in time
    // 2. No two entries should have the same course
    // 3. Entries should (preferably) be scheduled within the preferred time range
    // 4. Time range is defined by the start and end time of the day (e.g. 9:00 AM - 5:00 PM), and should be formatted with date-fns library when comparing time ranges (getHours)
    // 5. Entries should (preferably) be scheduled with professors in the order they are listed in the professors array (first: most preferred, last: least preferred)
    // 6. If a professor is not available for a course, the entry should be scheduled with the next preferred professor
    // 7. The function should return the optimized array of ScheduleEntry objects
    // 8. The input array of ScheduleEntry objects can repeat the same course and professor but with different time ranges
    // 9. The output should maximize the number of courses scheduled even if it means scheduling a course with a less preferred professor or outside the preferred time range

    entries.sort((a, b) => {
        if (a.course === b.course) {
            return professors.indexOf(a.professor) - professors.indexOf(b.professor);
        }
        return a.course.localeCompare(b.course);
    });

    const optimizedEntries: ScheduleEntry[] = [];
    const scheduledCourses = new Set<string>();

    for (const entry of entries) {
        if (scheduledCourses.has(entry.course)) {
            continue;
        }

        const isPreferredTime = entry.sessions.every((session: Session) => {
            const startHour = getHours(session.start);
            const endHour = getHours(session.end);
            return startHour >= getHours(preferredTimeRange.start) && endHour <= getHours(preferredTimeRange.end);
        });

        const hasOverlap = optimizedEntries.some(scheduledEntry => {
            return scheduledEntry.sessions.some(scheduledSession => {
                return entry.sessions.some(session => {
                    return session.day === scheduledSession.day &&
                        ((isBefore(session.start, scheduledSession.end) && isAfter(session.end, scheduledSession.start)));
                });
            });
        });

        if (!hasOverlap) {
            if (isPreferredTime) {
                optimizedEntries.unshift(entry);
            } else {
                optimizedEntries.push(entry);
            }
            scheduledCourses.add(entry.course);
        }
    }

    return optimizedEntries;
}