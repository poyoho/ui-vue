# dialog

<runtime></runtime>

## used

use `provide` register dialog state into root component and mount `DialogView` into vue template.

```ts
createApp({
  setup () {
    lib3.registerDialogView()
  },
  render: () => h("div", [
    h(lib3.DialogView),
    h(comp)
  ])
})
  .mount(container)
```

expose dialog api.

```ts
const dialog1 = createDialog(Content, {
  msg: 'hello world dialog1',
  onClose () {
    dialog1.close()
  }
})
dialog1.open()
```
