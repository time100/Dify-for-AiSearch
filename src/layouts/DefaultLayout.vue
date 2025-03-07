<template>
  <a-layout class="h-screen">
    <Header />
    <a-layout>
      <!-- <a-layout-sider>
        <Sidebar />
      </a-layout-sider> -->
      <a-layout-content>
        <div class="h-full px-6 flex-1">
          <slot></slot>
        </div>
      </a-layout-content>
    </a-layout>

    
  </a-layout>
</template>

<script setup lang="ts">
import Header from '../components/layout/Header.vue';

</script>


<style scoped lang="less"></style>
