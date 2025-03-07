<template>
  <div class="mt-16">

    <div class="overflow-auto h-[calc(100vh-70px)]">
      <section class="relative h-full overflow-hidden">
        <div class="relative z-10 container mx-auto px-4">
          <img class="my-20 mx-auto " src="https://io.onenov.cn/file/202501150249321.svg" alt="" />
          <div class="md:max-w-xl mx-auto mb-12">
            <h2 class="mb-5 font-heading font-bold text-4xl  text-center">About</h2>
            <div class="w-full p-4">
              <p class="text-lg text-color font-normal">基于 Dify
                工作流实现的AI搜索引擎，支持多轮对话、文件上传、语音输入，保存历史记录等。拥有强大的扩展性，支持任意Chatflow工作量接入。</p>
            </div>
            <div class="w-full p-0.5 pt-10">
              <div class="p-6 about-card rounded-lg">
                <div class="flex flex-wrap items-center justify-between -m-2">
                  <div class="p-2 flex-1">
                    <h3 class="mb-1 font-heading font-bold text-lg ">Dify 工作流</h3>
                    <p class="">
                      <span>Chatflow</span>
                      <span class=" ml-3">Dify</span>
                    </p>
                  </div>
                  <div class="w-auto p-2">
                    <a @click="downloadWorkYml" href="javascript:void(0)">
                      <a-button type="secondary">
                        <template #icon>
                          <icon-download />
                        </template>
                      </a-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col items-center justify-center">

            <a href="https://github.com/onenov/Dify-for-AiSearch" target="_blank">
              <a-button type="primary" size="large" class="mb-10">
                <template #icon>
                  <icon-github />
                </template>
                <template #default>GitHub</template>
              </a-button>
            </a>
            <Footer />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
const downloadWorkYml = () => {
  // 创建一个a标签用于下载
  const link = document.createElement('a');
  link.href = '/work.yml';
  link.download = 'work.yml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped lang="less">
.about-card {
  background-color: var(--color-filter) !important;
  -webkit-backdrop-filter: blur(var(--blur-x));
  backdrop-filter: blur(var(--blur-x));
  transition: all 0.3s all;
}
</style>
