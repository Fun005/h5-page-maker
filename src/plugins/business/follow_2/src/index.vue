<template>
    <div class="qk-follow-2">
        <div class="user-avatar">
            <img
                class="avatar-img"
                :src="userInfo.portrait"
                alt=""
                @click="handleNavigate"
            />
            <div class="follow-btn" @click="handleFollow">
                {{ userInfo.is_following ? '取消关注' : '关注' }}
            </div>
        </div>
        <div class="title-content ql-editor" v-html="richText_title"></div>
        <div class="user-content ql-editor" v-html="richText_right"></div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import API from './apis';

const defaultUserInfo = () => {
    return {
        portrait:
            'https://wiki.inkept.cn/download/attachments/688129/atl.site.logo?version=1&modificationDate=1505284386000&api=v2',
        nick: '未知',
        uid: '未知',
        is_following: false,
    };
};

export default {
    name: 'QkFollow2',
    // components: { VanButton: Button },
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
        richText_title: {
            label: '标题内容',
            type: String,
            default: '<p>这里是标题</p>',
        },
        richText_right: {
            label: '右边内容',
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
$height: 171px;
$width: 375px;

.qk-follow-2 {
    height: 171px;
    width: 375px;
    display: flex;
    align-items: center;
    // justify-content: space-evenly;
    background-image: url(https://img.ikstatic.cn/MTU4OTI3Nzg0OTczMiMzNDYjcG5n.png);
    background-size: 100% 100%;
    // background-color: purple;

    .user-avatar {
        // overflow: hidden;
        position: relative;
        // border-radius: 34px;
        // top: 0px;
        // left: 100px;
        height: inke-px2percent(68px, $height);
        width: inke-px2percent(68px);
        margin-left: inke-px2percent(60px);

        .avatar-img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
            background-color: #ddd;
        }

        .follow-btn {
            position: absolute;
            bottom: inke-px2percent(-10px, 68px);
            left: 50%;
            transform: translateX(-50%);
            width: inke-px2percent(64px, 68px);
            height: inke-px2percent(22px, 68px);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            padding: 0;
            color: #fff;
            border-radius: 22px;
            background-color: #ff8578;
        }
    }

    .title-content {
        position: absolute;
        top: inke-px2percent(-5px, $height);
        right: inke-px2percent(55px);
        height: inke-px2percent(47.5px, $height);
        width: inke-px2percent(111.5px);
    }

    .user-content {
        margin-left: inke-px2percent(30px);
        margin-top: inke-px2percent(18.5px);
        height: inke-px2percent(77.5px, $height);
        width: inke-px2percent(164px);
        overflow: auto;
        // font-size: 11px;
    }
}
</style>
