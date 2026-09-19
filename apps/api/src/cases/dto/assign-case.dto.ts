import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Priority } from '@claim-solution/db';

export class AssignCaseDto {
  @IsString({ message: 'investigatorId must be a string' })
  @IsUUID('4', { message: 'investigatorId must be a valid UUID' })
  @IsNotEmpty({ message: 'investigatorId is required' })
  investigatorId!: string;

  @IsNumber({}, { message: 'version must be a number' })
  @IsInt({ message: 'version must be an integer' })
  @IsNotEmpty({ message: 'version is required for concurrency control' })
  version!: number;

  @IsEnum(Priority, { message: 'Invalid priority level' })
  @IsOptional()
  priority?: Priority;

  @IsString({ message: 'notes must be a string' })
  @IsOptional()
  notes?: string;
}
