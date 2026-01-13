import bcrypt from 'bcrypt'

const solt_count = 10;

export function hashPassword(password){
   return bcrypt.hash(password,solt_count)
}

export  function comparePassword(password,hash){
   return bcrypt.compare(password,hash)
}