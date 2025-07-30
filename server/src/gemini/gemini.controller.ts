import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { PromptDto } from './dto/prompt.dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/guards';


@UseGuards(JwtAuthGuard)
@Controller('gemini')
export class GeminiController {
	constructor(private readonly geminiService: GeminiService) { }

	@Post('generate-program')
	generateProgram(@CurrentUser() user: User, @Body() prompt: PromptDto) {
		this.geminiService.generateProgram(user.id, prompt);
	}
}
