import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';

// initialize configuration
dotenv.config()

export default function verifyToken(req: Request, res: Response, next:any): any {
    const token: any = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function (err) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });

        // if everything's good
        next();
    });
}
