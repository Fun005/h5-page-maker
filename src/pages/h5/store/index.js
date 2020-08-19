import Vue from 'vue'
import Vuex from 'vuex'

// 各个模块
import shared from '@/store'

/**
 * 全局状态管理
 */
const state = {

};
const actions = {};
const mutations = {};
const getters = {};

Vue.use(Vuex);
export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules: {
		shared
	}
});
