import { Request, Response } from 'express';
import { readJson, writeJson } from '../models/fileModel';
import { IUser } from '../types';

const USERS_FILE = 'users.json';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const users = await readJson<IUser>(USERS_FILE);

        if (users.find(u => u.email === email)) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const newUser: IUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password, 
            cart: []
        };

        users.push(newUser);
        await writeJson(USERS_FILE, users);

        res.cookie('auth_token', newUser.id.toString(), {
            httpOnly: true,
            maxAge: 10 * 60 * 1000, 
            sameSite: 'lax'
        });

        res.status(201).json({ message: 'Success', user: { ...newUser, password: '' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const users = await readJson<IUser>(USERS_FILE);
        
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        res.cookie('auth_token', user.id.toString(), {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
            sameSite: 'lax'
        });

        res.json({ message: 'Login success', user: { ...user, password: '' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies['auth_token'];
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const users = await readJson<IUser>(USERS_FILE);
    const user = users.find(u => u.id.toString() === token);

    if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    res.json({ user: { ...user, password: '' } });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out' });
};
