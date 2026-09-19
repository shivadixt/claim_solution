import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Priority, RiskLevel } from '@claim-solution/db';

export class TriageCaseDto {
  @IsEnum(Priority, { message: 'Invalid priority level' })
  @IsOptional()
  priority?: Priority;

  @IsEnum(RiskLevel, { message: 'Invalid risk level' })
  @IsOptional()
  riskLevel?: RiskLevel;

  @IsNumber({}, { message: 'version must be a number' })
  @IsInt({ message: 'version must be an integer' })
  @IsNotEmpty({ message: 'version is required for concurrency control' })
  version!: number;
}
