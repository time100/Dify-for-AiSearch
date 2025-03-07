import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';

// 文档类型定义
interface LegalDocument {
  title: string;
  version: string;
  lastUpdated: string;
  content: Array<{
    section: string;
    items: Array<{
      title?: string;
      content: string;
    }>;
  }>;
}

// 法律文档存储
export const useLegalDocsStore = defineStore('legalDocs', () => {
  // 隐私政策
  const privacyPolicy = reactive<LegalDocument>({
    title: '',
    version: '',
    lastUpdated: '',
    content: []
  });
  
  // 服务条款
  const serviceAgreement = reactive<LegalDocument>({
    title: '',
    version: '',
    lastUpdated: '',
    content: []
  });
  
  // 加载状态
  const loading = ref({
    privacyPolicy: false,
    serviceAgreement: false
  });
  
  // 错误状态
  const error = ref({
    privacyPolicy: null as Error | null,
    serviceAgreement: null as Error | null
  });
  
  // 加载隐私政策
  const loadPrivacyPolicy = async () => {
    loading.value.privacyPolicy = true;
    error.value.privacyPolicy = null;
    
    try {
      const response = await axios.get('/data/PrivacyPolicy.json');
      if (response.data) {
        Object.assign(privacyPolicy, response.data);
      }
    } catch (err) {
      console.error('Failed to load privacy policy', err);
      error.value.privacyPolicy = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value.privacyPolicy = false;
    }
  };
  
  // 加载服务条款
  const loadServiceAgreement = async () => {
    loading.value.serviceAgreement = true;
    error.value.serviceAgreement = null;
    
    try {
      const response = await axios.get('/data/ServiceAgreement.json');
      if (response.data) {
        Object.assign(serviceAgreement, response.data);
      }
    } catch (err) {
      console.error('Failed to load service agreement', err);
      error.value.serviceAgreement = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value.serviceAgreement = false;
    }
  };
  
  // 加载所有法律文档
  const loadAllDocs = async () => {
    await Promise.all([
      loadPrivacyPolicy(),
      loadServiceAgreement()
    ]);
  };
  
  return {
    privacyPolicy,
    serviceAgreement,
    loading,
    error,
    loadPrivacyPolicy,
    loadServiceAgreement,
    loadAllDocs
  };
});
