import { h, reactive } from '@ui-vue/adapter'
import {
  provideDialogState,
  injectDialogState,
  ReactiveState,
  DialogViewState,
  ShowOptions
} from './context'

type hParams = Parameters<typeof h>

export function createDialog (
  tag: hParams[0],
  data: hParams[1],
  children?: hParams[2]
) {
  let _dialogState: DialogViewState | null = null
  const dialogState = injectDialogState()
  const token = dialogState.count++ // one instance one dialog
  return {
    show (options?: ShowOptions) {
      if (_dialogState) {
        return
      }
      _dialogState = {
        // because vue2 will change value of `data`
        component: () => h(tag, Object.assign({}, data), children),
        key: token,
        data: {
          bar: options?.bar
        },
      }
      dialogState.state.stack.push(_dialogState)
    },
    close () {
      if (!_dialogState) {
        return
      }
      const index = dialogState.state.stack.findIndex(v => _dialogState === v)
      dialogState.state.stack.splice(index, 1)
      _dialogState = null
    }
  }
}

export function registerDialogView () {
  // because `Object.defineproperty` cannot listen for array changes
  // so listen for changes in array elements through an attribute of the object
  const state = reactive<ReactiveState>({
    stack: []
  })
  provideDialogState({
    state,
    count: 0
  })
}
