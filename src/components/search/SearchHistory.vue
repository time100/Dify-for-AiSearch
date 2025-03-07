<template>
    <div>
        <a-button type="primary" shape="circle" size="small" @click="handleClick">
            <template #icon>
                <icon-history />
            </template>
        </a-button>

        <a-drawer width="auto" class="history-drawer" :visible="visible" placement="left" @ok="handleOk"
            @cancel="handleCancel" unmountOnClose>
            <template #title>
                <div class="flex justify-between items-center w-full">
                    <span>搜索历史</span>
                </div>
            </template>

            <div>
                <a-empty v-if="groupedConversations.length === 0" description="暂无搜索历史" />
                <div v-else>
                    <a-card class="mb-1" hoverable v-for="conversation in groupedConversations" :key="conversation.id"
                        @click="handleHistoryClick(conversation)">
                        <div class="flex items-center justify-between">
                            <span class="flex items-center justify-between w-full">
                                <div class="flex items-center">
                                    <a-tag class="mr-2 shrink-0" size="small"
                                        :color="getTypeColor(conversation.search_type)">
                                        {{ getTypeName(conversation.search_type) }}
                                    </a-tag>

                                    <div class=" whitespace-normal line-clamp-2 cursor-pointer">{{ conversation.query }}
                                    </div>
                                </div>
                                <a-tooltip :content="formatTime(conversation.timestamp)" position="left"
                                    background-color="#165DFF" mini>
                                    <a-button type="secondary" class="shrink-0 ml-2" size="mini" shape="circle">
                                        <template #icon>
                                            <icon-clock-circle />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                            </span>
                        </div>
                    </a-card>
                </div>
            </div>

            <template #footer>
                <div class="w-full">

                    <a-button type="primary" status="danger" size="small" shape="round" @click="handleClearHistory"
                        long>
                        <template #icon>
                            <icon-delete />
                        </template>
                        清空历史
                    </a-button>
                </div>
            </template>

        </a-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getChatHistory, clearChatHistory } from '../../api/search';
import { clearAllSerperResults } from '../../api/serper';
import { Message } from '@arco-design/web-vue';
import { useAppConfigStore } from '../../stores/appConfig';

const appConfig = useAppConfigStore();
const router = useRouter();
const visible = ref(false);
const chatHistory = ref<any[]>([]);

// 将历史记录按对话分组，仅显示每个对话的第一个问题
const groupedConversations = computed(() => {
    // 保存按conversation_id分组后的结果
    const conversations = new Map<string, any>();

    // 先处理有conversation_id的记录
    chatHistory.value.forEach(item => {
        if (item.conversation_id) {
            // 如果此conversation_id已存在
            if (conversations.has(item.conversation_id)) {
                const existingConversation = conversations.get(item.conversation_id);

                // 如果当前记录更早（是对话的初始问题）
                if (item.timestamp < existingConversation.timestamp) {
                    // 更新为最早的记录，同时保留计数
                    const count = existingConversation.count || 1;
                    conversations.set(item.conversation_id, {
                        ...item,
                        count: count
                    });
                } else {
                    // 增加该对话的问题计数
                    existingConversation.count = (existingConversation.count || 1) + 1;
                }
            } else {
                // 新增一个对话组
                conversations.set(item.conversation_id, {
                    ...item,
                    count: 1
                });
            }
        } else {
            // 没有conversation_id的视为单独对话，使用ID作为key
            conversations.set(item.id, {
                ...item,
                count: 1
            });
        }
    });

    // 转换为数组并按时间排序（最新的在前面）
    return Array.from(conversations.values())
        .sort((a, b) => b.timestamp - a.timestamp);
});

// 获取历史记录
const loadHistory = () => {
    chatHistory.value = getChatHistory();
};

// 打开历史记录抽屉
const handleClick = () => {
    loadHistory(); // 每次打开时刷新历史记录
    visible.value = true;
};

// 关闭抽屉
const handleOk = () => {
    visible.value = false;
};

const handleCancel = () => {
    visible.value = false;
};

// 清空历史记录
const handleClearHistory = () => {
    if (chatHistory.value.length === 0) {
        Message.info('暂无历史记录');
        return;
    }

    // 清空聊天历史
    clearChatHistory();

    // 同时清空Serper搜索结果
    clearAllSerperResults();

    chatHistory.value = [];
    Message.success('历史记录已清空');
};

// 点击历史记录项
const handleHistoryClick = (conversation: any) => {
    visible.value = false; // 关闭抽屉

    // 跳转到主页，传递会话ID参数
    router.push({
        path: '/',
        query: {
            q: conversation.query,
            type: conversation.search_type,
            conversation_id: conversation.conversation_id || conversation.id,
            session_id: conversation.id // 添加session_id参数
        }
    });
};

// 获取搜索类型的中文名称
const getTypeName = (type: string): string => {
    // 从配置中查找对应的标签
    const option = appConfig.config.SEARCH_OPTIONS.find(opt => opt.value === type);
    if (option) {
        return option.label;
    }

    // 如果在配置中找不到，使用备用映射关系
    const backupTypeMap: { [key: string]: string } = {
        'web': '网页搜索',
        'image': '图像搜索',
        'code': '代码搜索'
    };

    return backupTypeMap[type] || type;
};

// 获取搜索类型对应的标签颜色
const getTypeColor = (type: string): string => {
    // 颜色列表
    const colors = [
        'red',
        'orangered',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'arcoblue',
        'purple',
        'pinkpurple',
        'magenta'
    ];

    // 使用类型字符串作为伪随机种子生成索引，保证同一类型总是分配到相同的颜色
    let hashCode = 0;
    for (let i = 0; i < type.length; i++) {
        hashCode += type.charCodeAt(i);
    }

    // 获取该类型对应的颜色索引
    const colorIndex = hashCode % colors.length;

    return colors[colorIndex];
};

// 格式化时间戳
const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();

    // 如果是今天的记录，只显示时间
    if (date.toDateString() === now.toDateString()) {
        return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    // 如果是昨天的记录
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    // 其他日期显示完整日期
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 组件挂载时加载历史记录
onMounted(() => {
    loadHistory();
});
</script>

<style scoped lang="less"></style>