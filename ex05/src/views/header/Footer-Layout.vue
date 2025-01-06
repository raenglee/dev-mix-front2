<template>
  <div class="bg-[#d10000] w-full text-white p-4 px-72 text-center">
    <p class="font-bold">DEVMIX</p>
    <div class="text-sm py-2">
      <p class="mb-1">주소: 대구광역시 중구 중앙대로 394 제일빌딩 505호</p>
      <div class="flex gap-1 text-sm justify-center mb-1">
        <p>대표: 정세엽 | 공동 대표: 김재형 김채언 이상진 이주현</p>
      </div>
      <p>전화번호: 053-572-1005</p>
    </div>

    <button 
      @click="scrollToTop" 
      class="fixed bottom-5 right-5 bg-white border-2 border-[#d10000] text-[#d10000] hover:bg-red-100 p-4 rounded-full shadow-lg transition duration-300 ease-in-out">
      ↑
    </button>
  </div>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};</script>

<style lang="scss" scoped></style>
