<script setup lang="tsx">
defineOptions({
  name: 'TestTsx',
})
import { ref } from 'vue'

const count = ref(1)

const Counter = () => {
  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  )
}
</script>

<template>
  <Counter />
</template>
