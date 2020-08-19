// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '矩形边框',
	icon: 'iconfont iconjuxing',
	valueType: '',
	defaultStyle: {
		width: 120,
		height: 100,
		borderColor: '#999999',
		borderStyle: 'solid',
		borderWidth: 2
	}
})

export default Component
