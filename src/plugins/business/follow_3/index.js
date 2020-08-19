// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '关注样式3',
	icon: 'iconfont iconduoxuan',
	valueType: '',
	defaultStyle: {
		height: 200,
		width: 375,
		top: 330
	}
})

export default Component
