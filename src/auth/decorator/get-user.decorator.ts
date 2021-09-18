import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const { password, salt, ...result } = ctx.switchToHttp().getRequest().user;
        return result;
    }
);