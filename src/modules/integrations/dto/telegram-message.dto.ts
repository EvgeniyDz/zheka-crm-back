import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class TelegramMessageDto {
  @ApiProperty({ example: 'New order was created' })
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  text!: string;
}
