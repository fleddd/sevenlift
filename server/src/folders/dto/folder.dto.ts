import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class FolderDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateFolderDto extends PartialType(FolderDto) { }