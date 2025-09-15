import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common'
import { QuizzesService } from './quizzes.service'
import { CreateQuizDto } from './dto/create-quiz.dto'

@Controller('quizzes')
export class QuizzesController {
	constructor(private readonly quizzesService: QuizzesService) { }
	

	@Post()
	create(@Body() dto: CreateQuizDto) {
		return this.quizzesService.create(dto)
	}

	@Get()
	findAll() {
		return this.quizzesService.findAll()
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.quizzesService.findOne(id)
	}

	@Delete(":id")
	@HttpCode(204)
	async remove(@Param('id', ParseIntPipe) id: number) {
		await this.quizzesService.remove(id)
	}
}