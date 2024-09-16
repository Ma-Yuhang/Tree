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
          />
        </div>
      </transition>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { inject, provide, ref } from 'vue'
import type { TreeCompProps, Tree, TreeData } from './type'
defineOptions({
  name: 'TreeComp',
})
const { data, showCheckbox = true, uniqueKey = 'id' } = defineProps<TreeCompProps>()
// 用一个数组存储是否折叠与展开
const isOpen = ref<boolean[]>(new Array(data.length).fill(true))
const emit = defineEmits(['select-change'])

// 判断是否有子树
const hasChildren = (node: Tree) => {
  return !!(node.children && node.children.length > 0)
}
// 采用依赖注入的方式拿到父节点（上一级提供父节点这一层的数组，并不是精确的父节点）
// 这里是递归，上一级提供父节点这一层的数组， 下一级注入父节点这一层的数组
const parentNode: TreeData | null = inject('parentNode', null)
provide('parentNode', data)

// 复选框变化
const checkboxChange = (node: Tree) => {
  // 父节点的复选框变化，同步子节点
  const updateChildCheck = (node: Tree) => {
    if (hasChildren(node)) {
      node.children!.forEach((child) => {
        child.checked = node.checked
        updateChildCheck(child)
      })
    }
  }
  updateChildCheck(node)

  // 子节点的复选框变化，同步父节点
  const updateParentCheck = (node: Tree) => {
    if (parentNode) {
      ;(parentNode as TreeData).forEach((pNode) => {
        if (pNode.children?.includes(node)) {
          // 如果进入此分支，说明当前的 pNode 就是父节点
          const allChildrenChecked = pNode.children.every((child) => child.checked)
          if (pNode.checked !== allChildrenChecked) {
            pNode.checked = allChildrenChecked
            updateParentCheck(pNode)
          }
        }
      })
    }
  }
  updateParentCheck(node)

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
