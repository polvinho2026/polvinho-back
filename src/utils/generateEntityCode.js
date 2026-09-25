export function generateEntityCode(title, createdAt = new Date(), digit = 0) {
    if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
        throw new Error('Data de criação inválida.');
    }
    if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
        throw new Error('O dígito do código deve estar entre 0 e 9.');
    }

    const prefix = generateEntityPrefix(title);
    const year = String(createdAt.getUTCFullYear()).slice(-2).padStart(2, '0');
    const semester = createdAt.getUTCMonth() < 5 ? '01' : '02';
    return `${prefix}${year}${semester}-${digit}`;
}

export function generateEntityPrefix(title) {
    if (typeof title !== 'string') {
        throw new Error('O título deve ser um texto.');
    }

    const words = title
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/[^a-zA-Z\s]/g, '')
        .toUpperCase()
        .split(/\s+/)
        .filter(word => word.length > 2);

    if (words.length === 0) {
        throw new Error('O título deve conter ao menos uma palavra com 3 letras.');
    }

    if (words.length === 1) return words[0].slice(0, 3);
    if (words.length === 2) return words[0][0] + words[1].slice(0, 2);
    return words[0][0] + words[1][0] + words.at(-1)[0];
}
