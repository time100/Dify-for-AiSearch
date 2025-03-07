<script setup lang="ts">
import { computed } from 'vue';
import { useAppConfigStore } from '../../stores/appConfig';
import { useRouter } from 'vue-router';

const router = useRouter();
const appConfigStore = useAppConfigStore();
const currentYear = new Date().getFullYear();

// 从配置中获取版权信息
const copyright = computed(() => appConfigStore.config.FOOTER_COPYRIGHT || 'AI Search');
const icpRecord = computed(() => appConfigStore.config.ICP_RECORD || '');
const securityFiling = computed(() => appConfigStore.config.PUBLIC_SECURITY_FILING_NUMBER || '');

</script>

<template>
  <a-layout-footer class="text-center">

    <p>Copyright {{ currentYear }}. All rights reserved by {{ copyright }}.</p>

    <div v-if="icpRecord || securityFiling" class="mt-2 text-xs text-gray-500">
      <a v-if="icpRecord" href="https://beian.miit.gov.cn/" target="_blank" class="mr-2">{{ icpRecord }}</a>
      <a v-if="securityFiling" href="http://www.beian.gov.cn/" target="_blank">{{ securityFiling }}</a>
    </div>
  </a-layout-footer>
</template>

<style scoped lang="less">
.hover\:text-primary:hover {
  color: #1890ff;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
