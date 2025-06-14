<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import EventsModal from '@/components/modals/EventsModal.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useModal } from '@/composables/useModal'
import { eventsService } from '@/services/eventsService'
import { onMounted, onUnmounted, ref } from 'vue'
import Pencil from '~icons/lucide/pencil'
import Plus from '~icons/lucide/plus'
import Trash from '~icons/lucide/trash'

onMounted(eventsService.search)
onUnmounted(eventsService.clearPagination)

const selectedEventId = ref<number>()
const { open, isOpen } = useModal()

/**
 * Выбор сущности для редактирования.
 *
 * @param entityId - ID сущности.
 */
function selectEvent(entityId: number) {
  selectedEventId.value = entityId
  open()
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">
          События сообщества
        </h1>
        <Button @click="open">
          <Plus class="mr-2 h-4 w-4" />
          Добавить событие
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Место</TableHead>
                <TableHead>Спикеры</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="eventsService.items.value.total === 0" class="h-24">
                <TableCell colspan="7" class="text-center">
                  События не найдены
                </TableCell>
              </TableRow>
              <TableRow v-for="event in eventsService.items.value.items" :key="event.id">
                <TableCell>{{ new Date(event.date).toLocaleString() }}</TableCell>
                <TableCell>{{ event.title }}</TableCell>
                <TableCell>{{ event.eventType }}</TableCell>
                <TableCell>{{ event.place }}</TableCell>
                <TableCell>{{ event.hosts?.map((host) => `${host.firstName} ${host.lastName}`).join(', ') }}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" @click="selectEvent(event.id)">
                    <Pencil class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="eventsService.delete(event.id)">
                    <Trash class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div class="mt-4 flex justify-end">
        <Pagination v-slot="{ page }" :items-per-page="10" :total="eventsService.items.value.total" :sibling-count="1" show-edges :default-page="1">
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items">
              <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'" @click="eventsService.changePagination(item.value)">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </div>
    </div>
    <EventsModal v-model:is-open="isOpen" :event-id="selectedEventId" @saved="eventsService.search" />
  </AdminLayout>
</template>
