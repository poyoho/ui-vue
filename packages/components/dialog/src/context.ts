import { VNode, provide, inject } from '@ui-vue/adapter'

export interface ShowOptions {
  bar?: boolean
}

export interface DialogViewState {
  component: () => VNode
  data: ShowOptions
  key: number | string
}

export type ReactiveState = { stack: DialogViewState[] }

export interface ProvideDialogState {
  state: ReactiveState
  count: number
}

const token = Symbol('dialog component key')

export function provideDialogState (state: ProvideDialogState) {
  provide<ProvideDialogState>(token, state)
}

export function injectDialogState () {
  const data = inject<ProvideDialogState>(token)!
  if (__DEV__ && !data) {
    throw 'use component<DialogView> first!'
  }
  return data
}
