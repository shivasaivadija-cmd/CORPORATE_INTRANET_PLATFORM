import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsObject,
  ValidateNested,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PollOptionDto {
  @IsString()
  text: string;
}

class CreatePollDto {
  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsDateString()
  endsAt: string;

  @IsOptional()
  @IsBoolean()
  allowMultiple?: boolean;
}

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['TEXT', 'RICH', 'POLL'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['PUBLIC', 'DEPARTMENT', 'TEAM', 'PRIVATE'])
  visibility?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  richContent?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mentions?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePollDto)
  poll?: CreatePollDto;
}
