import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
export class ValidateQuestion {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @MinLength(10)
    question: string

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    sessionId: string 
}