export type PetMessageStatus = 'draft' | 'published' | 'offline'
export type PetMessageCategory =
  | 'greeting'
  | 'encouragement'
  | 'wisdom'
  | 'break'
  | 'weather'
  | 'holiday'
  | 'focus'

export interface IDeepTabPetMessage {
  id: string
  content: string
  language: string
  category: PetMessageCategory
  status: PetMessageStatus
  priority: number
  durationSeconds: number
  createDate: number
  updateDate: number
}

export interface IPetMessageListParams {
  page?: number
  pageSize?: number
  keyword?: string
  language?: string
  category?: PetMessageCategory | ''
  status?: PetMessageStatus | ''
}
