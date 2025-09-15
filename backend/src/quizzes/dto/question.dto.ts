import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
  IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'

export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

export class OptionDto {
  @IsString()
  @MinLength(1)
  text!: string

  @IsBoolean()
  isCorrect!: boolean
}

export class AnswerTextDto {
  @IsString()
  @MinLength(1)
  value!: string
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type!: QuestionType

  @IsString()
  @MinLength(1)
  text!: string

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options?: OptionDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerTextDto)
  answers?: AnswerTextDto[]
}