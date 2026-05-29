import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
    async hashPassword(password: string): Promise<string> {
        const saltround = 5
        return await hash(password, saltround)
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash)
    }
}






