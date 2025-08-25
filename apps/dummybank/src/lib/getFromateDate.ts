export const getCurrentDate = () => {
    const date1 = new Date();
    const date2 = new Date();
    const timestamp = date1.toDateString() + " " + date2.toLocaleTimeString();
    // Mon Aug 25 2025 00:22:03 GMT+0530 (India Standard Time)
    return new Date(timestamp);
};