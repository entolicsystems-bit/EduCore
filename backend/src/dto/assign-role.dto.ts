import { IsInt, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsString()
  userId: string;

  @IsInt()
  roleId: number;
}
