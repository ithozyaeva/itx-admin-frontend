<script setup lang="ts">
import type { MemberRole } from '@/models/members'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { requiredRule, useFormValidation } from '@/composables/useFormValidation'
import { MEMBER_ROLE_OPTIONS } from '@/models/members'
import { memberService } from '@/services/memberService'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  memberId: number | null
}>()

const emit = defineEmits(['saved', 'cancel'])
const isLoading = ref(false)

const validationRules = {
  firstName: [requiredRule],
  lastName: [],
  birthday: [],
  role: [requiredRule],
  tg: [requiredRule],
  id: [],
}

// Используем composable для валидации формы
const { values, errors, touched, validate, handleBlur, isValid, resetForm } = useFormValidation({
  firstName: '',
  lastName: '',
  tg: '',
  role: 'UNSUBSCRIBER' as MemberRole,
  id: props.memberId,
  birthday: '',
  tgId: 0,
}, validationRules)

// Загрузка данных участника при редактировании
onMounted(async () => {
  if (props.memberId) {
    isLoading.value = true
    const member = await memberService.getById(props.memberId)
    if (member) {
      values.value.firstName = member.firstName
      values.value.lastName = member.lastName
      values.value.tg = member.tg
      values.value.tgId = member.telegramID
      values.value.birthday = member.birthday
    }
    isLoading.value = false
  }
})

// Обработчик отправки формы
async function handleSubmit(e: Event) {
  e.preventDefault()

  if (!validate()) {
    return
  }

  if (props.memberId) {
    // Обновление существующего участника
    await memberService.update(props.memberId, {
      firstName: values.value.firstName,
      lastName: values.value.lastName,
      tg: values.value.tg,
      role: values.value.role,
      telegramID: values.value.tgId,
      birthday: values.value.birthday,
    })
  }
  else {
    // Создание нового участника
    await memberService.create({
      firstName: values.value.firstName,
      lastName: values.value.lastName,
      tg: values.value.tg,
      role: values.value.role,
      telegramID: values.value.tgId,
      birthday: values.value.birthday,
    })
  }
  resetForm()
  emit('saved')
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form class="space-y-6" @submit="handleSubmit">
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="name">Имя участника</Label>
        <Input
          id="firstName"
          v-model="values.firstName"
          placeholder="Введите имя участника"
          :class="{ 'border-red-500': touched.firstName && errors.firstName }"
          @blur="handleBlur('firstName')"
        />
        <p v-if="touched.firstName && errors.firstName" class="text-sm text-red-500">
          {{ errors.firstName }}
        </p>
      </div>

      <div class="space-y-2">
        <Label for="name">Фамилия участника</Label>
        <Input
          id="lastName"
          v-model="values.lastName"
          placeholder="Введите имя участника"
          :class="{ 'border-red-500': touched.lastName && errors.lastName }"
          @blur="handleBlur('lastName')"
        />
        <p v-if="touched.firstName && errors.lastName" class="text-sm text-red-500">
          {{ errors.lastName }}
        </p>
      </div>
      <div class="space-y-2">
        <Label for="name">Дата рождения участника</Label>
        <Input
          id="birthDate"
          v-model="values.birthday"
          type="date"
          placeholder="Введите ДР"
          :class="{ 'border-red-500': touched.lastName && errors.birthday }"
          @blur="handleBlur('birthday')"
        />
        <p v-if="touched.firstName && errors.birthday" class="text-sm text-red-500">
          {{ errors.birthday }}
        </p>
      </div>

      <div class="space-y-2">
        <Label for="name">Уровень подписки участника</Label>
        <Select id="mentor" v-model="values.role">
          <SelectTrigger>
            <SelectValue placeholder="Выберите уровень подписки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="mentorItem in MEMBER_ROLE_OPTIONS" :key="mentorItem.value" :value="mentorItem.value">
              {{ mentorItem.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p v-if="touched.firstName && errors.lastName" class="text-sm text-red-500">
          {{ errors.lastName }}
        </p>
      </div>

      <div class="space-y-2">
        <Label for="tg">Telegram</Label>
        <Input
          id="tg"
          v-model="values.tg"
          placeholder="Введите username в Telegram (например, @username)"
          :class="{ 'border-red-500': touched.tg && errors.tg }"
          @blur="handleBlur('tg')"
        />
        <p v-if="touched.tg && errors.tg" class="text-sm text-red-500">
          {{ errors.tg }}
        </p>
      </div>
    </div>

    <div class="flex justify-end space-x-2">
      <Button type="button" variant="outline" @click="handleCancel">
        Отмена
      </Button>
      <Button type="submit" :disabled="isLoading || !isValid">
        {{ isLoading ? 'Сохранение...' : props.memberId ? 'Сохранить' : 'Добавить' }}
      </Button>
    </div>
  </form>
</template>
