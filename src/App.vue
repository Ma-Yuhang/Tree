<template>
  <div>
    <h1>树形组件</h1>
    <tree-comp :data="data" :show-checkbox="true" @select-change="handleSelectChange"></tree-comp>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TreeComp from './components/TreeComp/index.vue'
import type { TreeData } from '@/components/TreeComp/type.ts'

const data = reactive<TreeData>([
  {
    label: '一级 1',
    checked: false,
    id: '1',
    children: [
      {
        label: '二级 1-1',
        checked: false,
        id: '2',
        children: [
          {
            label: '三级 1-1-1',
            checked: false,
            id: '3',
          },
        ],
      },
      {
        label: '二级 1-2',
        checked: false,
        id: '4',
      },
      {
        label: '二级 1-3',
        checked: false,
        id: '5',
        children: [
          {
            label: '三级 1-3-1',
            checked: false,
            id: '6',
          },
        ],
      },
    ],
  },
  {
    label: '一级 2',
    checked: false,
    id: '7',
    children: [
      {
        label: '二级 2-1',
        checked: false,
        id: '8',
        children: [
          {
            label: '三级 2-1-1',
            checked: false,
            id: '9',
          },
        ],
      },
      {
        label: '二级 2-2',
        checked: false,
        id: '10',
      },
    ],
  },
])

const handleSelectChange = (data: TreeData) => {
  console.log(data)
}
</script>

<style scoped></style>
