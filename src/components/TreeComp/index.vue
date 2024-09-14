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
        :parent="item"
        :showCheckbox="showCheckbox"
        :uniqueKey="uniqueKey"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TreeCompProps, Tree } from './type'
defineOptions({
  name: 'TreeComp'
})
const { data, showCheckbox = true, uniqueKey = 'id', parent } = defineProps<TreeCompProps>()

const emit = defineEmits(['update:data', 'select-change'])
const selectChange = (item: Tree) => {
  checkedHandle(item)
  // emit('update:data', data)
  // emit('select-change', data)
}
const checkedHandle = (item: Tree) => {
  if (item.children) {
    item.children.forEach((child) => {
      child.checked = item.checked
      checkedHandle(child)
    })
  }
  if (parent) {
    const checked = parent.children!.every((child) => child.checked)
    parent.checked = checked
  }
  console.log(parent, 'parent')
}
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
