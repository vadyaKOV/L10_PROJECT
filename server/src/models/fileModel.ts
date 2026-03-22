import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db');

export const readJson = async <T>(fileName: string): Promise<T[]> => {
    const filePath = path.join(DB_PATH, fileName);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        if (!data) return [];
        return JSON.parse(data) as T[];
    } catch (error) {
        console.error(`Error reading ${fileName}`, error);
        return [];
    }
};

export const writeJson = async <T>(fileName: string, data: T[]): Promise<void> => {
    const filePath = path.join(DB_PATH, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};
