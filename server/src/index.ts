import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
