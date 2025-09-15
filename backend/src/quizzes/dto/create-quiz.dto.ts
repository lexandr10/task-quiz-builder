import { ArrayMinSize, IsArray, IsString, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateQuestionDto } from './question.dto'

export class CreateQuizDto {
  @IsString()
  @MinLength(1)
  title!: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions!: CreateQuestionDto[]
}