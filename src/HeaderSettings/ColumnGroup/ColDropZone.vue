<template>
  <li class="-col-drop-zone"
    @drop.stop="handleDrop"
    @dragenter.stop="handleDragEnter"
    @dragover.stop.prevent="handleDropOver"
    @dragleave.stop="handleDragLeave">
  </li>
</template>
<script>
import arrMove from '../../_utils/arrMove'

export default {
  props: {
    columns: { type: Array, required: true },
    targetIdx: { type: Number, required: true },
    draggingIdx: Number
  },
  methods: {
    isAllowedToDrop () {
      const { targetIdx, draggingIdx } = this
      // do not allow to drop into the adjacent col-drop-zones
      return !(targetIdx === draggingIdx || targetIdx - draggingIdx === 1)
    },
    handleDrop () {
      if (!this.isAllowedToDrop()) return
      arrMove(this.columns, this.draggingIdx, this.targetIdx)
      this.rmReadyCls()
    },
    handleDragEnter () {
      this.isAllowedToDrop() && $(this.$el).addClass('-droppable')
    },
    handleDropOver (e) {
      e.dataTransfer.dropEffect = this.isAllowedToDrop() ? 'move' : 'none'
    },
    handleDragLeave () {
      this.isAllowedToDrop() && this.rmReadyCls()
    },
    rmReadyCls () {
      $(this.$el).removeClass('-droppable')
    }
  }
}
</script>
<style>
.-col-drop-zone {
  height: 1px;
  transition: height .5s ease;
}
.-droppable {
  height: 30px;
  border: 1px dashed #ddd;
  border-radius: 4px;
}
</style>
