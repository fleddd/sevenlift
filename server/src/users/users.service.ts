import { Injectable } from '@nestjs/common';
import { Provider, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }


    async createUser(email: string, password: string, provider: Provider, name: string) {
        const newUser = await this.prisma.user.create({
            data: {
                email,
                password,
                provider,
                name,
            },
        });
        const { password: newUserPassword, ...newUserWithoutPassword } = newUser;
        return newUserWithoutPassword;
    }
    findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    findUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    getAllUsers() {
        return this.prisma.user.findMany();
    }

    async updateUserById(id: string, data: Partial<User>) {
        return await this.prisma.user.update({
            where: { id },
            data,
        });
    }
}
