import { IsNotEmpty, IsString } from "class-validator";

export class enrollstudentDTO{
    @IsString()
    @IsNotEmpty()
    studentId: string
}