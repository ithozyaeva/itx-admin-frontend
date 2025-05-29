import type { Member } from './members'

export interface CommunityEvent {
  id: number
  title: string
  description: string
  date: string
  placeType: PlaceType
  place: string
  customPlaceType: string
  eventType: string
  open: boolean
  videoLink: string
  hosts: Member[]
}

export type PlaceType = 'ONLINE' | 'OFFLINE' | 'HYBRID'

export const PlaceTypeRu: Record<PlaceType, string> = {
  ONLINE: 'Онлайн',
  OFFLINE: 'Оффлайн',
  HYBRID: 'Гибрид',
}

export const PlaceTypeSelectOptions: Array<{ value: PlaceType, label: string }> = [
  { value: 'ONLINE', label: 'Онлайн' },
  { value: 'OFFLINE', label: 'Оффлайн' },
  { value: 'HYBRID', label: 'Гибрид' },
]
