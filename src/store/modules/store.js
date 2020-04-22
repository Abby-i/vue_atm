/*
vuex的核心管理对象模块：Store
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state= {
        status: 0,// 0: 待输入卡号 1: 待输入密码 2:待选择业务
        account: {
            objectId: '',
            account: '',
            password: '',
            balance: '',
            type: 0,
        }
    }
    const getters={
        account: state => state.account,
        status: state => state.status
    }
   const mutations={
        SET_ACCOUNT: (state, account) =>{
            state.account = account
        },
        CLEAR_ACCOUNT: (state) =>{
            state.account = {}
        },
        SET_STATUS: (state) =>{
            state.status += 1
        },
        STATUS: (state,status) =>{
          state.status = status
        },
        CLEAR_STATUS: (state) =>{
            state.status = 0
        }

    }
  const  actions={

    }


export default new Vuex.Store({
  state, //状态对象
  mutations, //包含多个更新state函数的对象
  actions, //包含多个对应事件回调函数的对象
  getters //包含多个getter计算属性函数的对象
})

