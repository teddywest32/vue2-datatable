$('head').append(`<style>
  .-dragging {
    opacity: 0.5;
  }
  .-col-drop-zone {
    height: 10px;
    background: orange;
    transition: height .5s ease;
  }
  .-droppable {
    height: 30px;
    border: 1px dashed #ddd;
    border-radius: 4px;
  }
</style>`)

// refers to https://github.com/sindresorhus/array-move
function arrMove(arr, from, to) {
  arr.splice((to < 0 ? arr.length + to : to), 0, arr.splice(from, 1)[0])
}

/**
 * invoke this function within `mounted`
 * @param {VueInstance} vm
 */
export default function (vm) {
  const $ColGroupContainer = $(vm.$el).find('div.-col-group-container')

  const DRAGGABLE = 'li[draggable=true]'
  const DROP_ZONE = 'li.-col-drop-zone'

  function generateDropZones() {
    const dropZoneGen = idx => `<li class="-col-drop-zone" target-idx="${idx}"></li>`

    $ColGroupContainer
      .find(DROP_ZONE).remove().end() // ensure no drop zone exists
      .find('li').each(function (idx) {
        const $this = $(this)
        $this.attr('draggable', 'true')
        $this.attr('source-idx', idx)

        $this.before(
          dropZoneGen(
            idx - ($this.is('li:first-of-type') ? 0.25 : 0)
          )
        )

        if ($this.is('li:last-of-type')) {
          $this.after(dropZoneGen(idx + 0.25))
        }
      })
  }

  vm.$watch('columns', () => {
    vm.$nextTick(generateDropZones)
  }, { immediate: true })

  let draggingIdx = null

  $.fn.isAllowedToDrop = function () {
    const targetIdx = +$(this).attr('target-idx')
    return ![0, 0.25, 1].includes(targetIdx - draggingIdx)
  }

  $ColGroupContainer
    .on('dragstart', DRAGGABLE, function () {
      draggingIdx = +$(this).addClass('-dragging').attr('source-idx')
    })
    .on('dragend', DRAGGABLE, function () {
      draggingIdx = null
      $(this).removeClass('-dragging')
    })
    .on('dragover', DROP_ZONE, function (e) {
      e.preventDefault() // must
      e.originalEvent.dataTransfer.dropEffect = $(this).isAllowedToDrop() ? 'move' : 'none'
    })
    .on('dragenter', DROP_ZONE, function () {
      const $this = $(this)
      $this.isAllowedToDrop() && $this.addClass('-droppable')
    })
    .on('drop', DROP_ZONE, function () {
      const $this = $(this)
      if (!$this.isAllowedToDrop()) return
      $this.removeClass('-droppable')

      const { columns } = vm

      let targetIdx = +$this.attr('target-idx')
      // const realTargetIdx = Math.ceil(targetIdx)
      columns[draggingIdx].group = columns[Math.round(targetIdx)].group

      console.log('draggingIdx', draggingIdx)
      console.log('realTargetIdx', ~~targetIdx)
      console.log('groupname', columns[draggingIdx].group)

      arrMove(columns, draggingIdx, ~~targetIdx)
    })
    .on('dragleave', DROP_ZONE, function () {
      const $this = $(this)
      $this.isAllowedToDrop() && $this.removeClass('-droppable')
    })
}
