export function validateDateISO(dataStr) {

    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dataStr)) return false;

    const data = new Date(dataStr);

    if (isNaN(data.getTime())) return false;

    return data.toISOString().slice(0, 10) === dataStr;
};