import * as argon2 from 'argon2';

export async function hash(stringToHash: string): Promise<string> {
    return await argon2.hash(stringToHash)
}
export async function verifyHash(stringToVerify: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, stringToVerify);
}

