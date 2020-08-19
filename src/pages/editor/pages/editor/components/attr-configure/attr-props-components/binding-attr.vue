<template>
    <div>
        <p class="page-title fontBold">数据绑定</p>
        <div class="binding">
            <div
                v-for="(binding, index) in bindings"
                :key="binding.key.join('.')"
                class="binding-item"
            >
                <el-cascader
                    v-model="binding.key"
                    :options="bindKeys"
                    @change="handleSelectKey(index, $event)"
                ></el-cascader>
                <!-- <el-dropdown @command="handleSelectKey">
                    <span class="el-dropdown-link">
                        {{ binding.keyLabel }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            v-for="item in bindKeys"
                            :key="item.value"
                            :command="item.value"
                            >{{ item.label }}</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </el-dropdown> -->
                <div class="arrow el-icon-d-arrow-left"></div>
                <el-cascader
                    :show-all-levels="false"
                    v-model="binding.value"
                    :options="bindValues"
                    @change="handleSelectValue(index, $event)"
                ></el-cascader>
                <div class="remove el-icon-remove-outline" @click="handleRemoveBinding(index)"></div>

                <!-- <el-dropdown @command="handleSelectValue">
                    <span class="el-dropdown-link">
                        {{ binding.valueLabel }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            v-for="item in bindValues"
                            :key="item.value"
                            :command="item.value"
                            >{{ item.label }}</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </el-dropdown> -->
            </div>
            <el-button 
                class="add-binding"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="handleAddBinding"
                >增加一个绑定</el-button
            >
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            selectedProps: [],
        };
    },
    computed: {
        ...mapGetters(['activeElement', 'sharedData']),

        bindings() {
            return this.activeElement.bindings;
        },

        bindKeys() {
            return Object.entries(this.activeElement.propsValue).map(
                ([key, value]) => ({
                    value: key,
                    label: value.label || key.slice(0, 8),
                    disabled: this.bindings.some((binding) =>
                        binding.key.includes(key)
                    ),
                })
            );
        },

        bindValues() {
            return Object.entries(this.sharedData).map(([key, value]) => ({
                value: key,
                label: key.slice(0, 8),
                children: Object.entries(value).map(([childKey]) => ({
                    value: childKey,
                    label: childKey,
                    disabled: this.bindings.some((binding) =>
                        binding.value.includes(childKey)
                    ),
                })),
            }));
        },
    },
    created() {},
    mounted() {},
    methods: {
        /**
         * 纪录一条历史纪录
         * */
        addHistory() {
            // console.log('common style change addHistoryCache')
            this.$store.dispatch('addHistoryCache');
        },
        /**
         * 点击绑定key
         */
        handleSelectKey(index, e) {
            // this.activeElement.bindings[index] = e
            console.log(e);
        },
        /**
         * 点击绑定值
         */
        handleSelectValue(index, e) {
            console.log(e);
        },
        /**
         * 增加绑定
         */
        handleAddBinding() {
            if (!this.activeElement.bindings) {
                this.$set(this.activeElement, 'bindings', []);
            }
            this.activeElement.bindings.push({
                key: [],
                value: [],
            });
        },

        /**
         * 删除绑定
         */
        handleRemoveBinding(index) {
            this.activeElement.bindings.splice(index, 1)
        }

    },
};
</script>

<style lang="scss" scoped>
.binding {
    margin: 10px 0 30px 0;
    .binding-item {
        margin-top: 10px;
        // max-width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-dropdown-link {
            cursor: pointer;
            color: #409eff;
        }
        .el-icon-arrow-down {
            font-size: 12px;
        }

        .arrow {
            margin: 0 10px;
        }

        .remove {
            margin-left: 10px;
            font-size: 20px;
        }
    }

    .add-binding {
        margin-top: 10px;
    }
}
</style>
