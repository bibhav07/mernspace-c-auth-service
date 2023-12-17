import { Repository } from "typeorm";
import { User } from "../entity/User";
import { userData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: userData) {
        
        const isEmailExists = await this.userRepository.findOne({where : {email}});
        if(isEmailExists) {
            const err = createHttpError(400, "email already taken");
            throw err;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        try {

            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
        } catch (err) {
            const error = createHttpError(500, "unable to store data in DB");
            throw error;
        }
    }
}
