import { Column, Entity, PrimaryGeneratedColumn }                from 'typeorm';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export const PropertyTypes: string[] = ['Townhouse', 'Condominium', 'SingleFamilyResidence'];

@Entity()
export class Property {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  @IsString({ groups: ['create', 'update'] })
  @Column({ type: 'text' })
  address: string;

  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  @IsNumber(undefined, { groups: ['create', 'update'] })
  @Min(0, { groups: ['create', 'update'] })
  @Column({ type: 'decimal' })
  price: number;

  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  @IsNumber(undefined, { groups: ['create', 'update'] })
  @Min(0, { groups: ['create', 'update'] })
  @Column({ type: 'smallint' })
  bedrooms: number;

  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  @IsNumber(undefined, { groups: ['create', 'update'] })
  @Min(0, { groups: ['create', 'update'] })
  @Column({ type: 'smallint' })
  bathrooms: number;

  @IsOptional({ groups: ['create', 'update'] })
  @IsIn(PropertyTypes, { groups: ['create', 'update'] })
  @Column({ type: 'text', nullable: true })
  type: string | null;
}
