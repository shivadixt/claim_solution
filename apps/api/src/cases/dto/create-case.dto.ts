import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClaimType, Priority, RiskLevel } from '@claim-solution/db';

export class ClaimantDto {
  @IsString({ message: 'claimant.firstName must be a string' })
  @IsNotEmpty({ message: 'claimant.firstName is required' })
  firstName!: string;

  @IsString({ message: 'claimant.lastName must be a string' })
  @IsNotEmpty({ message: 'claimant.lastName is required' })
  lastName!: string;
}

export class ProviderDto {
  @IsString({ message: 'provider.name must be a string' })
  @IsNotEmpty({ message: 'provider.name is required' })
  name!: string;

  @IsString({ message: 'provider.hospitalName must be a string' })
  @IsNotEmpty({ message: 'provider.hospitalName is required' })
  hospitalName!: string;

  @IsString({ message: 'provider.type must be a string' })
  @IsOptional()
  type?: string;
}

export class CreateCaseDto {
  @IsString({ message: 'claimNumber must be a string' })
  @IsNotEmpty({ message: 'claimNumber is required' })
  claimNumber!: string;

  @IsString({ message: 'policyNumber must be a string' })
  @IsNotEmpty({ message: 'policyNumber is required' })
  policyNumber!: string;

  @IsEnum(ClaimType, { message: 'Invalid claim type' })
  claimType!: ClaimType;

  @IsNumber({}, { message: 'claimAmount must be a number' })
  @IsPositive({ message: 'claimAmount must be greater than 0' })
  claimAmount!: number;

  @IsEnum(Priority, { message: 'Invalid priority level' })
  priority!: Priority;

  @IsEnum(RiskLevel, { message: 'Invalid risk level' })
  @IsOptional()
  riskLevel?: RiskLevel;

  @IsString({ message: 'clientId must be a string' })
  @IsOptional()
  clientId?: string;

  @ValidateNested()
  @Type(() => ClaimantDto)
  @IsNotEmpty({ message: 'claimant object is required' })
  claimant!: ClaimantDto;

  @ValidateNested()
  @Type(() => ProviderDto)
  @IsNotEmpty({ message: 'provider object is required' })
  provider!: ProviderDto;
}
