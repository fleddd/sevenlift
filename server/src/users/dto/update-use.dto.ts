import { IsNotEmpty } from "class-validator";
import { $Enums, User } from "generated/prisma";

export class UpdateUserDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    email: string;


    currentPlanId: string | null;
}