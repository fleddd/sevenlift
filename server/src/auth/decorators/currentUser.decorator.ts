import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'generated/prisma';

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		const user = ctx.switchToHttp().getRequest().user as User;
		const { password, refreshToken, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}
);
