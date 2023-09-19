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
      demo: 2500,
      demoBoolean: true,
      canRegenerate: false,
    }
  },
})
</script>

<template>
  <div>
    <div class="flex justify-center items-center flex-col">
      <h1 class="text-4xl font-bold mb-4 text-center">
        Manor Generator
      </h1>

      <!--  controllers  -->
      <!--  change the width and deep of the manor -->
      <div class="flex justify-center items-center mb-4">
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
              :disabled="!canRegenerate"
              @click="$refs.manor.generateDynamics()"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              :class="{'opacity-50 cursor-not-allowed': !canRegenerate}">
            Regenerate
          </button>
        </div>

        <div class="flex flex-col mr-4">
          <label for="demo" class="text-xs">Demo delay: {{ demo }}ms</label>
          <input type="range" id="demo" v-model="demo" :min="0" :max="10000" :step="100" class="mb-2"/>
          <div class="flex">
            <span class="mr-2">Activate demo :</span> <input type="checkbox" id="demo" v-model="demoBoolean"/>
          </div>
        </div>


        <span class="text-xs mb-2">
        <small>based on UE5</small><br>
        <b class="text-red-600">X</b> : left/right<br>
        <b class="text-green-500">Y</b> : forward/backward<br>
        <b class="text-blue-800">Z</b> : up/down
      </span>
      </div>

      <ManorGeneration
          ref="manor"
          :manorWidth="manorWidth"
          :manorDeep="manorDeep"
          :demo="demoBoolean ? demo : 0"
          @update:canRegenerate="canRegenerate = $event"
      />
    </div>
  </div>

  <rooms-panel-preview/>
</template>

<style scoped>

</style>
