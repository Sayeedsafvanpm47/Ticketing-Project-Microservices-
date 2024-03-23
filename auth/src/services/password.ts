import {scrypt,randomBytes} from 'crypto' 
import {promisify} from 'util'

const scryptAsync = promisify(scrypt)

export class Password{
          static async ToHash(password:string)
          {
             const salt = randomBytes(8).toString('hex')
             const buf = (await scryptAsync(password,salt,64)) as Buffer
             return `${buf.toString('hex')}.${salt}`
          }
          //static methods are methods which can be accessed without having to create an instance, it is an instance method          
          static async compare(storedPassword:string,suppliedPassword:string)
          {
            const [hashedPassword,salt] = storedPassword.split('.');
            const buf = (await scryptAsync(suppliedPassword,salt,64)) as Buffer 
            return buf.toString('hex') === hashedPassword 
          }
}