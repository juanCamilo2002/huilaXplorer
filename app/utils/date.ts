export const calculateDaysAndNights = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const timeDifference = endDate.getTime() - startDate.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    const nights = dayDifference > 1 ? dayDifference - 1 : 0;

    return { days: dayDifference, nights };
};