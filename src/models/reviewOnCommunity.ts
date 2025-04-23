import type { Member } from './members'

export interface ReviewOnCommunity {
  id: number
  authorId: number
  author: Member
  text: string
  date: string
  status: ReviewStatus
}

export interface ReviewOnCommunityFormData {
  id?: number
  authorId?: number
  authorTg?: string
  text: string
  date: string
}

export type ReviewStatus = 'DRAFT' | 'APPROVED'

export const REVIEW_STATUS_NAMES: Record<ReviewStatus, string> = {
  APPROVED: 'Опубликован',
  DRAFT: 'На модерации',
}
