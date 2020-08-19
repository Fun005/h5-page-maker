<template>
    <div class="qk-follow-3">
        <div class="user-avatar" @click="handleNavigate">
            <img class="avatar-img" :src="userInfo.portrait" alt="" />
            <img
                class="avatar-border"
                src="https://img.ikstatic.cn/MTU4OTc5NDU0Njk3MiM3MzkjcG5n.png"
                alt=""
            />
        </div>
        <div class="user-info">
            <div class="info-content">
                <div class="user-nick">{{ userInfo.nick }}</div>
                <div class="user-uid">主播UID: {{ userInfo.uid }}</div>
            </div>
            <div class="user-content ql-editor" v-html="richText_intro"></div>
        </div>
        <div class="follow-btn" @click="handleFollow">
            {{ userInfo.is_following ? '取消关注' : '点击关注' }}
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import API from './apis';
import PluginMixins from '../../../mixins/pluginMixins';

const defaultUserInfo = () => {
    return {
        portrait: 'https://img.ikstatic.cn/MTU4OTc5NDg4NzgyOSM0NTMjcG5n.png',
        nick: '未知',
        uid: '未知',
        is_following: false,
    };
};

export default {
    name: 'QkFollow3',
    // components: { VanButton: Button },
    mixins: [PluginMixins],
    props: {
        text_anchorUid: {
            label: '主播uid',
            type: String,
            default: '',
        },
        text_url: {
            label: '点击头像跳转链接',
            type: String,
            default: '',
        },
        richText_intro: {
            label: '介绍内容',
            type: String,
            default: '<p>这是一段文字html</p>',
        },
    },
    data() {
        return {
            userInfo: defaultUserInfo(),
        };
    },
    created() {},
    mounted() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            if (!this.text_anchorUid) return;
            API.GET_USER_CARD({ uids: this.text_anchorUid }).then((res) => {
                this.userInfo = {
                    ...defaultUserInfo(),
                    ...res.data[this.text_anchorUid],
                };
            });
            this.$emit('setSharedData', { userUid: this.text_anchorUid });
        },
        async handleFollow() {
            if (this.userInfo.is_following) {
                await API.UNFOLLOW({ anchor_uid: this.text_anchorUid });
            } else {
                await API.FOLLOW({ anchor_uid: this.text_anchorUid });
            }
            Toast(this.userInfo.is_following ? '取消关注成功' : '关注成功');
            this.getUserInfo();
        },

        handleNavigate() {
            if (this.text_url) {
                if (this.text_url.indexOf('http') < 0) {
                    this.text_url = `${location.protocol}//${this.text_url}`;
                }
                location.href = this.text_url;
            }
        },
        // 自定义刷新组件的方法
        refresh() {
            this.fetchList();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@editor/common/styles/function';
$height: 200px;
$width: 375px;

.qk-follow-3 {
    height: 200px;
    width: 375px;
    display: flex;
    align-items: center;
    // justify-content: space-evenly;
    // background-color: purple;

    .user-avatar {
        top: -20px;
        // overflow: hidden;
        position: relative;
        // border-radius: 34px;
        // top: 0px;
        // left: 100px;
        height: 120px;
        width: 120px;
        margin-left: inke-px2percent(26px);

        .avatar-img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
            background-color: #ddd;
        }

        .avatar-border {
            height: 100%;
            width: 100%;
            transform: scale(1.15);
            position: absolute;
            top: -1px;
            left: 3px;
            background-color: transparent;
        }
    }

    .user-info {
        top: -20px;
        position: relative;
        margin-left: inke-px2percent(20px);
        height: inke-px2percent(77.5px, $height);
        width: inke-px2percent(184px);

        .info-content {
            border: 1px solid #00ffff;
            border-radius: 5px;
            color: #fff;
            padding: 4px 8px;
            height: inke-px2percent(44px, 77.5px);
            line-height: 1.2;

            .user-nick {
                font-size: 18px;
                font-weight: bold;
            }

            .user-uid {
                font-size: 12px;
            }
        }

        .user-content {
            margin-top: 8px;
            height: inke-px2percent(26px, 77.5px);
            box-sizing: border-box;
            border-radius: 5px;
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 4px 8px;
            line-height: 1;
        }
    }

    .follow-btn {
        position: absolute;
        bottom: inke-px2percent(22px, $height);
        left: 50%;
        transform: translateX(-50%);
        width: inke-px2percent(78px, $width);
        height: inke-px2percent(23px, $height);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        padding: 0;
        color: #333;
        border-radius: 5px;
        background-color: #f8b551;
    }
}
</style>
