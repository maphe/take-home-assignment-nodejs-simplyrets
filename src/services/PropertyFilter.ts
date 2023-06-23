import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { Type }                                                              from 'class-transformer';
import { PropertyTypes }                                                     from '../entities';

export class PropertyFilter {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ValidateIf(o => o.price !== undefined)
  @IsNotEmpty()
  @IsIn(['<', '>', '<=', '>=', '='])
  priceOperand?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bedrooms?: number;

  @ValidateIf(o => o.bedrooms !== undefined)
  @IsNotEmpty()
  @IsIn(['<', '>', '<=', '>=', '='])
  bedroomsOperand?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bathrooms?: number;

  @ValidateIf(o => o.bathrooms !== undefined)
  @IsNotEmpty()
  @IsIn(['<', '>', '<=', '>=', '='])
  bathroomsOperand?: string;

  @IsOptional()
  @IsIn(PropertyTypes)
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize?: number;
}