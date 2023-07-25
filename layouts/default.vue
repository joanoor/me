<template>
  <div>
    <header class="joanoor-header" flex justify-between items-center px-15 py-2>
      <div class="avatar">
        <img src="~/assets/web.png" alt="" height="45.6" width="45.6" rounded-15>
      </div>
      <div class="category" flex >
        <NuxtLink to="/home" mr-5>首页</NuxtLink>
        <NuxtLink to="/archives" mr-5>归档</NuxtLink>
        <NuxtLink to="/categories" mr-5>分类</NuxtLink>
        <NuxtLink to="/tags" mr-5>标签</NuxtLink>
        <NuxtLink to="/about">关于</NuxtLink>
      </div>
    </header>
    <div class="theme-toggle" px-15 flex justify-end>
      <ThemeToggle></ThemeToggle>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
console.log(colorMode.preference)
</script>

<style scoped lang="scss">
.joanoor-header {
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.06);
}

.theme-toggle {
  position: relative;
  margin-top: 10px;
  transition: 0.3s cubic-bezier(0.4, 0.03, 0, 1);
}
</style>