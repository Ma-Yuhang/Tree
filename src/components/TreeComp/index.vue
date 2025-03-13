<template>
  <ul>
    <li v-for="(node, index) in data" :key="node[uniqueKey]">
      <span
        style="cursor: pointer"
        v-if="hasChildren(node)"
        @click="isOpen[index] = !isOpen[index]"
      >
        {{ isOpen[index] ? '⬇️' : '➡️' }}
      </span>
      <input
        type="checkbox"
        v-if="showCheckbox"
        v-model="node.checked"
        @change="checkboxChange(node)"
      />
      <span>{{ node.label }}</span>
      <transition v-on="animation">
        <div v-show="isOpen[index]" v-if="hasChildren(node)">
          <tree-comp
            :data="node.children || []"
            :show-checkbox="showCheckbox"
            :unique-key="uniqueKey"
            @select-change="$emit('select-change', node)"
            @child-change="handleChildChange"
          />
        </div>
      </transition>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TreeCompProps, Tree } from './type'
defineOptions({
  name: 'TreeComp',
})
const { data, showCheckbox = true, uniqueKey = 'id' } = defineProps<TreeCompProps>()
// 用一个数组存储是否折叠与展开
const isOpen = ref<boolean[]>(new Array(data.length).fill(true))
const emit = defineEmits(['select-change', 'child-change'])

// 判断是否有子树
const hasChildren = (node: Tree): node is Tree & { children: Tree[] } => {
  return !!(node.children && node.children.length > 0)
}

// 处理子节点的状态变化
const handleChildChange = (childId: string) => {
  // 查找包含此childId的节点
  for (const node of data) {
    if (hasChildren(node)) {
      const childIndex = node.children!.findIndex((child) => child[uniqueKey] === childId)
      if (childIndex !== -1) {
        // 子节点状态已经变化，现在根据所有子节点的状态更新当前节点
        const allChildrenChecked = node.children!.every((child) => child.checked)
        if (node.checked !== allChildrenChecked) {
          node.checked = allChildrenChecked
          // 向上传递状态变化
          emit('child-change', node[uniqueKey])
        }
        break
      }
    }
  }
}

// 复选框变化
const checkboxChange = (node: Tree) => {
  // 父节点的复选框变化，同步子节点
  const updateChildCheck = (node: Tree) => {
    if (hasChildren(node)) {
      node.children.forEach((child) => {
        child.checked = node.checked
        updateChildCheck(child)
      })
    }
  }
  updateChildCheck(node)

  // 触发子节点变化事件，以便父组件更新
  emit('child-change', node[uniqueKey])

  // 触发自定义事件
  emit('select-change', node)
}

// 过渡动画相关的方法
const animation = {
  beforeEnter(el: any) {
    el.style.maxHeight = '0'
    el.style.opacity = '0'
    el.style.overflow = 'hidden'
  },
  enter(el: any) {
    el.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'
    el.style.maxHeight = el.scrollHeight + 'px'
    el.style.opacity = '1'
  },
  afterEnter(el: any) {
    el.style.maxHeight = 'none'
  },
  beforeLeave(el: any) {
    el.style.maxHeight = el.scrollHeight + 'px'
    el.style.opacity = '1'
    el.style.overflow = 'hidden'
  },
  leave(el: any) {
    el.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'
    el.style.maxHeight = '0'
    el.style.opacity = '0'
  },
  afterLeave(el: any) {
    el.style.maxHeight = 'none'
  },
}
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
