import bcrypt from 'bcrypt'

export const hashPassword = async (password : string) => {
    const salt = await bcrypt.genSalt(12)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async ( currentPassword : string, password: string ) => {
    const compare = await bcrypt.compare(currentPassword, password)
    return compare
}