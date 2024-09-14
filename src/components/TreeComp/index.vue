<template>
  <ul>
    <li v-for="item in data" :key="item[uniqueKey]">
      <input
        type="checkbox"
        v-if="showCheckbox"
        v-model="item.checked"
        @change="selectChange(item)"
      />
      <span>{{ item.label }}</span>
      <TreeComp
        v-if="item.children"
        :data="item.children"
        :show-checkbox="showCheckbox"
        :unique-key="uniqueKey"
        @select-change="selectChange"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TreeCompProps, Tree } from './type'
defineOptions({
  name: 'TreeComp',
})
const { data, showCheckbox = true, uniqueKey = 'id' } = defineProps<TreeCompProps>()

const emit = defineEmits(['select-change'])
const selectChange = (item: Tree) => {
  checkedHandle(item)
  emit('select-change', data)
}
const checkedHandle = (item: Tree) => {
  if (item.children) {
    item.children.forEach((child) => {
      child.checked = item.checked
      checkedHandle(child)
    })
  }
}
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
