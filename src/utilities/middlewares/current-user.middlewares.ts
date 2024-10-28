
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
    namespace Express {
        interface Request {
            user: UserEntity;
        }
    }
}

interface JwtPayload {
    id: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly userService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization

        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            next();
            return
        } else {
            try {
                const token = authHeader.split(' ')[1];
                const { id } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
                const user = await this.userService.findOne(id);
                req.user = user
                next()
            } catch (error) {
                req.user = null;
                next();
            }
        }
    }
}
