import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { CreateQuestionDto, QuestionType } from './dto/question.dto'

@Injectable()
export class QuizzesService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(input: CreateQuizDto) {
		this.validateQuiz(input)

		const normalizedQuestions = input.questions.map((q, idx) => ({
			...q,
			orderIndex: typeof q.orderIndex === 'number' ? q.orderIndex : idx,
		}))

		return this.prismaService.quiz.create({
			data: {
				title: input.title,
				questions: {
					create: normalizedQuestions.map(q => ({
						text: q.text,
						type: q.type,
						orderIndex: q.orderIndex,
						options:
							q.type !== QuestionType.INPUT && q.options?.length
								? {
										create: q.options.map(o => ({
											text: o.text,
											isCorrect: o.isCorrect,
										})),
									}
								: undefined,
						answers:
							q.type === QuestionType.INPUT && q.answers?.length
								? {
										create: q.answers.map(a => ({
											value: a.value,
										})),
									}
								: undefined,
					})),
				},
			},
			include: {
				questions: {
					include: { options: true, answers: true },
					orderBy: { orderIndex: 'asc' },
				},
			},
		})
	}

	async findAll() {
		const rows = await this.prismaService.quiz.findMany({
			select: {
				id: true,
				title: true,
				createdAt: true,
				_count: { select: { questions: true } },
			},
			orderBy: { createdAt: 'desc' },
		})

		return rows.map(r => ({
			id: r.id,
			title: r.title,
			questionCount: r._count.questions,
			createdAt: r.createdAt,
		}))
	}

	async findOne(id: number) {
		const quiz = await this.prismaService.quiz.findUnique({
			where: { id },
			include: {
				questions: {
					include: { options: true, answers: true },
					orderBy: { orderIndex: 'asc' },
				},
			},
		})
		if (!quiz) throw new NotFoundException('Quiz not found')
		return quiz
	}

	async remove(id: number) {
		try {
			await this.prismaService.quiz.delete({ where: { id } })
		} catch (error: any) {
			if (error?.code === 'P2025') throw new NotFoundException('Quiz not found')
			throw error
		}
	}

	private validateQuiz(input: CreateQuizDto) {
		if (!input.questions?.length) {
			throw new BadRequestException('Quiz must contain at least one question')
		}
		input.questions.forEach((q, idx) => this.validateQuestion(q, idx))
	}

	private validateQuestion(q: CreateQuestionDto, idx: number) {
		if (!q.text?.trim()) throw new BadRequestException(`Question[${idx}] text is required`)

		if (q.type === QuestionType.BOOLEAN) {
			const opts = q.options ?? []
			if (opts.length !== 2) {
				throw new BadRequestException(`Question[${idx}] BOOLEAN must have exactly 2 options`)
			}
			const correct = opts.filter(o => o.isCorrect)
			if (correct.length !== 1) {
				throw new BadRequestException(`Question[${idx}] BOOLEAN must have exactly 1 correct option`)
			}
		}

		if (q.type === QuestionType.CHECKBOX) {
			const opts = q.options ?? []
			if (opts.length < 2) {
				throw new BadRequestException(`Question[${idx}] CHECKBOX must have at least 2 options`)
			}
			const correct = opts.filter(o => o.isCorrect)
			if (correct.length < 1) {
				throw new BadRequestException(
					`Question[${idx}] CHECKBOX must have at least 1 correct option`,
				)
			}
		}

		if (q.type === QuestionType.INPUT) {
			const answers = q.answers ?? []
			if (answers.length < 1) {
				throw new BadRequestException(`Question[${idx}] INPUT must have at least 1 correct answer`)
			}
			if (answers.some(a => !a.value?.trim())) {
				throw new BadRequestException(`Question[${idx}] INPUT contains empty answer value`)
			}
		}
	}
}
