import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, { message: 'Name must be 2–100 characters' })
  name: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Invalid phone number',
  })
  phone: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  source: string;
}
