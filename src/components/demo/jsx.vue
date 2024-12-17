<script lang="jsx">
import { defineComponent } from 'vue'

const HelloWorld = defineComponent({
  setup() {
    return () => (
      <div>
        <h1>Hello, JSX!</h1>
        <p>This is a Vue component using JSX.</p>
      </div>
    );
  },
})

export default HelloWorld
</script>