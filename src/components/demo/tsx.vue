<script lang="tsx">
import { defineComponent, ref, reactive, computed } from 'vue';

export default defineComponent({
  name: 'HelloTSX',
  props: {
    testProp: {
      type: Number
    }
  },
  emits: ['testEmit'],
  setup(props, { slots, emit }) {
    const num = ref<number>(0)
    const list = reactive([
      1,
      2,
      3,
      4,
      5
    ])
    const count = computed(() => num.value)
    const increment = () => {
      num.value++
    }
    const doEmit = () => {
      emit('testEmit', 100)
    }
    return () => (
      <div class="tsx-demo">
        <h1>Hello, TSX!</h1>
        <div>{count.value}</div>
        <button onClick={increment}>+</button>
        {list.map((item) => (<div>{item}</div>))}
        {slots.testSlot ? slots.testSlot() : ''}
        {props.testProp}
        <button onClick={doEmit}>发送count</button>
        {count.value ? <div>是</div> : <div>否</div>}
      </div>
    );
  }
});
</script>
<style scoped lang="scss">
.tsx-demo {
  width: 500px;
  height: 500px;
}
</style>
