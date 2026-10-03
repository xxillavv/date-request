import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export enum DateAnswer {
  Yes = 'yes',
  No = 'no',
  Maybe = 'maybe',
}

export enum DateActivity {
  Coffee = 'coffee',
  Restaurant = 'restaurant',
  Cinema = 'cinema',
  Walk = 'walk',
  Other = 'other',
}

const isYes = (dto: CreateTelegramMessageDto) => dto.answer === DateAnswer.Yes;

export class CreateTelegramMessageDto {
  @IsEnum(DateAnswer)
  answer: DateAnswer;

  // Поля нижче обовʼязкові тільки якщо answer === 'yes'
  @ValidateIf(isYes)
  @IsDateString({ strict: true })
  date?: string; // 'YYYY-MM-DD'

  @ValidateIf(isYes)
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'time must be HH:mm' })
  time?: string;

  @ValidateIf(isYes)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  place?: string;

  @IsOptional()
  @IsEnum(DateActivity)
  activity?: DateActivity;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  wishes?: string;
}
