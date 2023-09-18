<script>
// import style
import './style.css';
import {defineComponent} from 'vue'
import ManorGeneration from "./components/ManorGeneration.vue";
import RoomsPanelPreview from "./components/RoomsPanelPreview.vue";

export default defineComponent({
  name: "App",
  components: { RoomsPanelPreview, ManorGeneration },
  data() {
    return {
      manorWidth: 10,
      manorDeep: 10,
      demo: 5000,
      demoBoolean: true,
    }
  },
})
</script>

<template>
  <div>
    <div class="flex justify-center items-center flex-col">
      <h1>Manor Generator</h1>
      <ManorGeneration
          ref="manor"
          :manorWidth="manorWidth"
          :manorDeep="manorDeep"
          :demo="demoBoolean ? demo : 0"
          @update:demoBoolean="demoBoolean = $event"
      />
    </div>

    <!--  controllers  -->
    <!--  change the width and deep of the manor -->
    <!--  and the rooms will be generated -->
    <div class="flex justify-center items-center">
<!--      <div class="flex flex-col">-->
<!--        <label for="width">Width</label>-->
<!--        <input type="number" id="width" v-model="manorWidth"/>-->
<!--      </div>-->
<!--      <div class="flex flex-col">-->
<!--        <label for="deep">Deep</label>-->
<!--        <input type="number" id="deep" v-model="manorDeep"/>-->
<!--      </div>-->
      <!-- regenerate -->
      <div class="flex flex-col">
        <button
            :disabled="demoBoolean"
            @click="$refs.manor.generateDynamics()"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            :class="{'opacity-50 cursor-not-allowed': demoBoolean}" >
          Regenerate
        </button>
      </div>
      <div class="flex flex-col">
        <label for="demo">Demo: {{ demo }}ms</label>
        <input type="range" id="demo" v-model="demo" min="0" max="10000" step="100" class="mb-2"/>
        <input type="checkbox" id="demo" v-model="demoBoolean"/>
      </div>
    </div>
  </div>

  <rooms-panel-preview />
</template>

<style scoped>

</style>
