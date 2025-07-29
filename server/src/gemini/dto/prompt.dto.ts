import { IsNotEmpty, IsString } from 'class-validator';

export class PromptDto {
	@IsString()
	@IsNotEmpty({ message: "Your prompt can't be empty." })
	prompt: string;
}
