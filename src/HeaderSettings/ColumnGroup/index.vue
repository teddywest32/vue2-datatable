<template>
  <ul class="-col-group" name="ColumnGroup">
    <label class="-col-group-title">
      {{ groupName === 'undefined' ? 'Columns' : groupName }}
    </label>
    <template v-for="(col, idx) in columns">
      <col-drop-zone :columns="columns" :dragging-idx="draggingIdx" :target-idx="idx" />
      <li
        ref="draggable"
        draggable="true"
        @dragstart.stop="handleDragStart(idx)"
        @dragend.stop="handleDragEnd(idx)">
        <input
          type="checkbox"
          :id="uuidGen(col.field || idx)"
          :name="groupName"
          :checked="isColVisible(col)"
          :disabled="typeof col.visible === 'string'"
          @change="handleChange(col, $event.target.checked)">
        <label :for="uuidGen(col.field || idx)">
          {{ col.label || col.title }}
          <i v-if="col.explain" class="fa fa-info-circle" style="cursor: help" :title="col.explain"></i>
        </label>
      </li>
    </template>
    <col-drop-zone :columns="columns" :dragging-idx="draggingIdx" :target-idx="columns.length" />
  </ul>
</template>
<script>
import sortBy from 'lodash/sortBy'
import ColDropZone from './ColDropZone'
import isColVisible from '../../_utils/isColVisible'

export default {
  name: 'ColumnGroup',
  components: { ColDropZone },
  props: {
    groupName: { type: String, required: true },
    columns: { type: Array, required: true }
  },
  data: () => ({
    changes: [], // record the changes with a stack
    draggingIdx: null
  }),
  methods: {
    handleChange (col, isChecked) {
      this.changes.push({ col, isChecked })
    },
    uuidGen (key) {
      // $vm._uid is a private property of a Vue instance
      return `-col-${this._uid}-${key}`
    },
    apply () {
      this.changes.forEach(({ col, isChecked }) => {
        this.$set(col, 'visible', isChecked)
      })
      this.changes = [] // don't forget to clear the stack
    },
    isColVisible,
    /* the following methods are related to the drag-and-drop sortable feature */
    handleDragStart (idx) {
      this.draggingIdx = idx
      $(this.$refs.draggable[idx]).addClass('-dragging')
    },
    handleDragEnd (idx) {
      this.draggingIdx = null
      $(this.$refs.draggable[idx]).removeClass('-dragging')
    }
  }
}
</script>
<style>
.-col-group {
  display: inline-block;
  width: 150px;
  padding: 0;
  vertical-align: top;
}
.-col-group-title {
  display: block;
  margin: 5px;
  padding: 5px;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
}
.-col-group > li {
  margin-bottom: 2px;
  padding-left: 10px;
  list-style: none;
  line-height: 20px;
  font-size: 12px;
}
.-col-group > li > input {
  vertical-align: -2px;
}
.-dragging {
  opacity: 0.5;
}
</style>
