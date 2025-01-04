<template>
  <div>
    <!--🙎‍♂️로그인 모달-->
    <div class="overlay" :class="{ isModal: isModal }" @click="closeModal"></div>
    <transition name="modal-fade">
      <div v-if="isModal" class="modal p-5 w-96 rounded-lg" :class="{ isView: isModal }">
        <div class="flex items-center justify-between">
          <h1 class="text-lg text-black font-bold">로그인</h1>
          <button class="h-4 w-4" @click="closeModal"><img src="/img/x.png" /></button>
        </div>

        <div class="m-5 justify-center">
          <div class="flex flex-col gap-3">
            <a :href="google_url"><img src="/img/sns_G.png" /></a>
            <a :href="kakao_url"><img src="/img/sns_k.png" /></a>
            <a :href="naver_url"><img src="/img/sns_n.png" /></a>
          </div>
        </div>

        <p class="text-center text-xs text-gray-400">
          소셜 로그인 시 <br />
          이용약관, 개인정보처리방침, 전자금융거래약관에 동의함으로 처리됩니다.
        </p>
      </div>
    </transition>
    <!--🙎‍♂️로그인 모달 끝-->
  </div>
</template>

<script setup>
import { LOGIN_URL } from '@/api/util.js';

const google_url = `http://localhost:8080/oauth2/authorization/google`;
const kakao_url = `http://localhost:8080/oauth2/authorization/kakao`;

// const google_url = `http://${LOGIN_URL}/oauth2/authorization/google`;
// const kakao_url = `http://${LOGIN_URL}/oauth2/authorization/kakao`;
const naver_url = `http://${LOGIN_URL}/oauth2/authorization/naver`;

import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isModal: Boolean
});

const emit = defineEmits(['update:isModal']);

const closeModal = () => {
  emit('update:isModal', false);
};
</script>

<style scoped>

/* 모달 애니메이션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter {
  opacity: 0;
  transform: translate(-50%, -50%) translateY(-50px); /* 애니메이션 시작 시 위쪽에서 시작 */
}

.modal-fade-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) translateY(0); /* 최종 위치는 중앙 */
  animation: bounceIn 0.5s ease-out; /* 튕기는 애니메이션 추가 */
}

.modal-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) translateY(50px); /* 닫힐 때 아래로 내려감 */
  animation: bounceOut 0.5s ease-in; /* 닫히는 애니메이션 */
}

/* 튕기는 효과 (열릴 때) */
@keyframes bounceIn {
  0% {
    transform: translate(-50%, -50%) translateY(-50px); /* 시작 위치 (살짝 위로) */
  }
  30% {
    transform: translate(-50%, -50%) translateY(10px); /* 살짝 아래로 내려감 */
  }
  50% {
    transform: translate(-50%, -50%) translateY(-5px); /* 다시 살짝 위로 튕김 */
  }
  100% {
    transform: translate(-50%, -50%) translateY(0); /* 최종 위치 (정상 위치) */
  }
}

/* 튕기는 효과 (닫힐 때) */
@keyframes bounceOut {
  0% {
    transform: translate(-50%, -50%) translateY(0); /* 시작 위치 */
  }
  50% {
    transform: translate(-50%, -50%) translateY(10px); /* 살짝 아래로 내려감 */
  }
  100% {
    transform: translate(-50%, -50%) translateY(50px); /* 아래로 내려가며 닫힘 */
  }
}
</style>
