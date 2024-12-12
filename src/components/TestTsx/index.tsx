import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MyComponent',
  setup() {
    const count = ref<number>(1)

    return () => (
      <div>
        <h1>标题</h1>
        {/* JSX中的注释写法 */}
        <div>{count.value}</div>
      </div>
    )
  },
})
