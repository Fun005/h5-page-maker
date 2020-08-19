import {
    HOST_DEV,
    HOST_EDITOR_BETA,
    HOST_EDITOR_ONLINE,
    HOST_EDITOR_TEST,
    HOST_H5_BETA,
    HOST_H5_ONLINE,
    HOST_H5_TEST,
    ORIGIN_DEV
} from './constants'

// const { location: { host: HOST, origin: ORIGIN } } = window
const {
    location: { host: HOST }
} = window

export const IS_DEV = process && process.env.NODE_ENV === 'development'

export const HOST_ENV = [HOST_H5_ONLINE, HOST_EDITOR_ONLINE, HOST_H5_BETA, HOST_EDITOR_BETA, HOST_H5_TEST, HOST_EDITOR_TEST].find(key => HOST.indexOf(key) === 0) || HOST_DEV

export const ORIGIN = IS_DEV ? ORIGIN_DEV : ''

export const prodRootMap = {
    [HOST_H5_ONLINE]: {
        baseapi: '//activity.me.busi.inke.cn/',
        bossapi: '//boss.me.inke.cn/',
        duiyuanapi: 'https://api.yingtaorelian.com/',
        h5host: HOST_H5_ONLINE, // h5 的访问地址
    },
    [HOST_EDITOR_ONLINE]: {
        baseapi: '//activity.me.busi.inke.cn/',
        bossapi: '//boss.me.inke.cn/',
        duiyuanapi: 'https://api.yingtaorelian.com/',
        h5host: HOST_H5_ONLINE, // h5 的访问地址
    },
    [HOST_H5_BETA]: {
        baseapi: '//betaactivity.busi.me.inke.cn/',
        bossapi: '//betaboss.me.inke.cn/',
        duiyuanapi: 'https://betaapi.yingtaorelian.com/',
        h5host: HOST_H5_BETA, // h5 的访问地址
    },
    [HOST_EDITOR_BETA]: {
        baseapi: '//betaactivity.busi.me.inke.cn/',
        bossapi: '//betaboss.me.inke.cn/',
        duiyuanapi: 'https://betaapi.yingtaorelian.com/',
        h5host: HOST_H5_BETA, // h5 的访问地址
    },
    [HOST_H5_TEST]: {
        baseapi: '//testactivity.busi.me.inke.cn/',
        bossapi: '//testboss.me.inke.cn/',
        duiyuanapi: 'https://testapi.yingtaorelian.com/',
        h5host: HOST_H5_TEST, // h5 的访问地址
    },
    [HOST_EDITOR_TEST]: {
        baseapi: '//testactivity.busi.me.inke.cn/',
        bossapi: '//testboss.me.inke.cn/',
        duiyuanapi: 'https://testapi.yingtaorelian.com/',
        h5host: HOST_H5_TEST, // h5 的访问地址
    }
}
// export const prodApi = prodRootMap[HOST_TEST]

const rootObj = prodRootMap[Object.keys(prodRootMap).find(key => HOST.indexOf(key) === 0)] || {}

const DEFAULT_ROOT = '/'

const getRootStr = rootStr => {
    return rootStr || DEFAULT_ROOT
}

const PROD = {
    APIS: {
        baseapi: getRootStr(rootObj.baseapi),
        bossapi: getRootStr(rootObj.bossapi),
        duiyuanapi: getRootStr(rootObj.duiyuanapi),
        h5host: getRootStr(rootObj.h5host)
    }
}

const DEV = {
    APIS: {
        baseapi: DEFAULT_ROOT,
        bossapi: DEFAULT_ROOT,
        duiyuanapi: DEFAULT_ROOT,
        h5host: HOST
    }
}

const ENV = IS_DEV ? DEV : PROD
export default ENV.APIS
