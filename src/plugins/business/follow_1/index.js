// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
Object.assign(Component, {
	title: '关注样式1',
	icon: 'iconfont icontupian',
	valueType: '',
	defaultStyle: {
		height: 95,
		width: 342.5,
		top: 300,
		backgroundColor: 'rgba(104, 46, 251, 1)'
	}
})

export default Component
