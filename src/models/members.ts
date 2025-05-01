export interface Member {
  id: number
  firstName: string
  lastName: string
  tg: string
  telegramID: number
  isMentor: boolean
  role: MemberRole
  birthday: string
}

export interface CreateMemberDto {
  firstName: string
  lastName: string
  tg: string
  role: MemberRole
}

export interface UpdateMemberDto {
  id: number
  firstName: string
  lastName: string
  tg: string
  role: MemberRole
}

export type MemberRole = 'UNSUBSCRIBER' | 'SUBSCRIBER' | 'MENTOR'

export const MEMBER_ROLE_OPTIONS: Array<{ value: MemberRole, label: string }> = [{
  value: 'UNSUBSCRIBER',
  label: 'Ансаб',
}, {
  value: 'SUBSCRIBER',
  label: 'Саб',
}, {
  value: 'MENTOR',
  label: 'Ментор',
}]
