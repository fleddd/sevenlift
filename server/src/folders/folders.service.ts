import { Injectable } from '@nestjs/common';
import { FolderDto, UpdateFolderDto } from './dto/folder.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) { }
  async create(userId: string, dto: FolderDto) {
    return await this.prisma.folder.create({
      data: {
        name: dto.name,
        user: { connect: { id: userId } },
      },

    });
  }

  async getAllByUserId(userId: string) {
    return await this.prisma.folder.findMany({
      where: {
        userId
      },
      include: {
        trainingPrograms: true,

      }
    });
  }


  async update(folderId: string, dto: UpdateFolderDto) {
    const folder = await this.prisma.folder.update({
      where: { id: folderId },
      data: {
        name: dto.name
      },
    });


    return folder;
  }

  async delete(folderId: string) {
    return await this.prisma.folder.delete({
      where:
      {
        id: folderId
      }
    })
  }
}
