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

export interface ITelegramResponse {
  answer: DateAnswer
  date: string
  time: string
  place: string
  activity: DateActivity
  wishes: string
}