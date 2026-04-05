<script setup lang="ts">
  import { computed } from 'vue';
  const props = defineProps<{
    pageSize: number;
    currentPage: number;
    count: number;
  }>();
  const emit = defineEmits<{
    'update:currentPage': [value: number];
    'update:pageSize': [value: number];
  }>();

  const changePageSize = (newPage: number) => {
    emit('update:pageSize', newPage);
  };
  const changePage = (newPage: number) => {
    emit('update:currentPage', newPage);
  };

  const handlePageSizeChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const newSize = Number(target.value);
    changePageSize(newSize);
    changePage(1);
  };

  const totalGroups = computed(() => {
    return props.count || 0;
  });
  const getDisplayRange = () => {
    const start = (props.currentPage - 1) * props.pageSize + 1;
    const end = Math.min(start + props.pageSize - 1, totalGroups.value);
    return { start, end };
  };
</script>

<template>
  <div class="page-size-selector">
    <span class="info-text">
      {{ getDisplayRange().start }}–{{ getDisplayRange().end }} из
      {{ totalGroups }}
    </span>
    <span>по:</span>
    <select :value="pageSize" @change="handlePageSizeChange($event)">
      <option :value="5">5</option>
      <option :value="10">10</option>
      <option :value="20">20</option>
      <option :value="50">50</option>
    </select>
  </div>
</template>

<style scoped>
  .page-size-selector {
    display: flex;
    justify-content: right;
    width: 166px;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 0.85rem;
  }
</style>
