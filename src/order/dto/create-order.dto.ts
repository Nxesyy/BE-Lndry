import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsNotEmpty()
  @IsNumber()
  pricePerKg: number;

  @IsNotEmpty()
  @IsDateString()
  estimatedFinish: string;
}
