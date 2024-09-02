<template>
  <div id="__nuxt">
    <transition name="fade" mode="out-in">
      <div class="flex">
        <div class="w-[25rem]">
            <MenuSidebar />
        </div>
        <div class="w-full flex-1">
            <MenuNav />
            <NuxtPage />
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
</style>