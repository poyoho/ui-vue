import Vue from 'vue2'
import type { PluginFunction, PluginObject } from 'vue2'

/**
* DebuggerEvent is a Vue 3 development only feature. This type cannot exist in Vue 2.
*/
export declare type DebuggerEvent = never

const Vue2 = Vue
const version = Vue.version

export type { VNode } from 'vue2'
export declare type Plugin = PluginObject<any> | PluginFunction<any>
export * from '@vue/composition-api'
export {
  Vue,
  Vue2,
  version,
}
