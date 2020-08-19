<template>
    <div class="qk-follow-1">
        <div class="user-avatar" @click="handleNavigate">
            <img :src="userInfo.portrait" alt="" />
        </div>
        <div class="user-info">
            <div class="user-nick">{{ userInfo.nick }}</div>
            <div class="user-uid">主播UID: {{ userInfo.uid }}</div>
            <div class="follow-btn">
                <span class="text" :style="{ color: defaultStyle.backgroundColor }">{{ userInfo.is_following ? '取消关注' : '点击关注' }}</span>
            </div>
        </div>
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
    name: 'QkFollow1',
    // components: { VanButton: Button },
    props: {
        defaultStyle: {
            type: Object,
            default: () => ({})
        },
        text_anchorUid: {
            label: '主播uid',
            type: String,
            default: '',
        },
        text_url: {
            label: '点击头像跳转链接',
            type: String,
            default: '',
        }
    },
    data() {
        return {
            userInfo: defaultUserInfo()
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
                    ...res.data[this.text_anchorUid]
                }
            });
        },
        async handleFollow() {
            if (this.followStatus) {
                await API.UNFOLLOW({ anchor_uid: this.text_anchorUid })
            } else {
                await API.FOLLOW({ anchor_uid: this.text_anchorUid })
            }
            Toast(this.followStatus ? '取消关注成功' : '关注成功')
            this.getUserInfo()
        },

        handleNavigate() {
            if (this.text_url) {
                location.href = this.text_url
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
$height: 95px;
$width: 342.5px;

.qk-follow-1 {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    // background-color: purple;

    .user-avatar {
        height: inke-px2percent(94px, $height);
        width: inke-px2percent(94px, $width);
        border: 3px solid #fff;
        overflow: hidden;
        position: absolute;
        left: inke-px2percent(9px, $width);
        top: inke-px2percent(-7px, $height);

        img {
            height: 100%;
            width: 100%;
        }
    }

    .user-info {
        // flex: 1;
        margin-left: inke-px2percent(120px, $width);
        font-size: 12px;
        color: #fff;
        width: inke-px2percent(180px, $width);
        height: inke-px2percent(69.5px, $height);
        .user-nick {
            // margin-top: 10px;
            font-weight: bold;
            font-size: 18px;
            position: relative;
            line-height: 1;
        }
        .user-uid {
            font-size: inke-px2percent(12px, 69.5px);
            margin-top: inke-px2percent(7px, $width);
        }
        .follow-btn {
            // margin-top: 5px;
            margin-top: inke-px2percent(11px, $width);

            background-color: #fff;
            // border: 1px solid #dddddd;
            // color: #fff;
            // border-radius: 15px;
            font-size: 11px;
            height: inke-px2percent(22.5px, 69.5px);
            width: inke-px2percent(67.5px, 180px);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            color: #000;

            // &::before {
            //     content: '';
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     height: 100%;
            //     width: 100%;
            //     background-color: #fff;
            // }
        }
    }
}
</style>
