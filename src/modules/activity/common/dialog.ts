import Alert from "../components/dialog/DialogTip.vue";

type Options = string | object
let Dialog: {
    install: Vue.PluginFunction<Options>
}

Dialog = {
    install: (Vue, options) => {
        if (document.getElementsByClassName('dialog').length) {
            return
        }
        // 创建构造器,创建一个“子类”。参数是一个包含组件选项的对象。
        let dialogTpl = Vue.extend(Alert)
        // 创建 $vm 实例。
        let $vm: any = new dialogTpl
        // 挂载到Vue 实例使用的根 DOM 元素
        let tpl = $vm.$mount().$el
        document.body.appendChild(tpl)
        // 添加实例方法
        Vue.prototype.$dialog = {
            show(toastName, options) {
                $vm.toastName = toastName
                if (typeof options === 'string') {
                    $vm.content = options
                } else if (toastName === 'reward') {
                    // Object.assign($vm, options)
                    $vm.rewardArr = options
                } else if (toastName === 'lucky') {
                    // Object.assign($vm, options)
                    $vm.luckyArr = options
                }
                $vm.showDialog = true
            },
            hide(toastName) {
                if (toastName) {
                    $vm.toastName = toastName;
                    return
                }
                $vm.showDialog = false
            }
        }
    }
}


export default Dialog