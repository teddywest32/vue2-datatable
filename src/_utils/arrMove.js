/**
 * Refers to https://github.com/sindresorhus/array-move
 * @param  {Array}  arr
 * @param  {Number} from - index of the source item
 * @param  {Number} to   - index of the target item
 */
export default function (arr, from, to) {
  arr.splice(from < to ? to - 1 : to, 0, arr.splice(from, 1)[0])
}
