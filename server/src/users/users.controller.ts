import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-use.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Get('me')
	getMe(@CurrentUser() user: User) {
		return this.usersService.findUserById(user.id);
	}

	@Patch()
	updateMe(@CurrentUser() user: User, @Body() updatedUser: UpdateUserDto) {
		return this.usersService.updateUserById(user.id, updatedUser)
	}

}
