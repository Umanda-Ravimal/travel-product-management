import {
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';
  
  export class GenerateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    prompt: string;
  }