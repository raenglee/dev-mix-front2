<template>
  <div>
    <!--🙎유저프로필 모달-->
    <div class="overlay" :class="{ isModal: isModal }" @click="closeModal"></div>
    <transition name="modal-fade">
      <div v-if="isModal" class="modal p-5 w-96 rounded-lg" :class="{ isView: isModal }">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-xl text-center">프로필</h2>
          <button class="h-4 w-4" @click="closeModal"><img src="/img/x.png" /></button>
        </div>
        <div class="flex flex-col items-center mb-4">
          <img v-if="profileImage" :src="profileImage" class="h-20 w-20 m-auto rounded-full object-cover" />
          <img v-else src="/img/people.png" class="h-20 w-20 rounded-full object-cover" />
          <p class="text-xl">{{ nickname }}</p>
        </div>
        <div class="flex flex-col items-center gap-1">
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100 my-2">소속</p>
          <div v-if="!groupName" class="text-gray-200 font-bold text-xl">DEVMIX</div>
          <p class="whitespace-nowrap mb-1 text-xl">{{ groupName }}</p>
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100 my-2">거주 지역</p>
          <div v-if="!location" class="text-gray-200 font-bold text-xl">DEVMIX</div>
          <p class="whitespace-nowrap mb-1 text-xl">{{ location }}</p>
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100 my-2">포지션</p>
          <div v-if="positions.length === 0" class="text-gray-200 font-bold text-xl">DEVMIX</div>
          <ul class="mb-1 flex flex-wrap justify-center gap-1">
            <p v-for="(position, index) in positions" :key="index" class="whitespace-nowrap text-center text-lg mx-2 px-1">
              {{ position }}
            </p>
          </ul>
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100 my-2">기술 스택</p>
          <div class="flex gap-4 mb-4 flex-wrap text-center justify-center">
            <div class="py-1" v-for="tech in techStacks" :key="tech">
              <img :src="tech.imageUrl" class="w-8 h-8" />
              <span class="text-sm">{{ tech.techStackName }}</span>
              
            </div>
            <div v-if="techStacks == null || techStacks?.length === 0" class="text-gray-200 font-bold text-xl">DEVMIX</div>
          </div>
        </div>
      </div>
    </transition>
    <!--🙎‍♂️모달 끝-->
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { defineProps, defineEmits } from 'vue';

import { getUserInfo } from '@/api/userApi';

// props 정의
const props = defineProps({
  isModal: Boolean, // 모달의 가시성 상태
  user_id: Number // 유저 ID
});

//console.log(JSON.stringify(props));

// emit 정의
const emit = defineEmits(['update:isModal']);

// 모달을 닫는 함수

const closeModal = () => {
  emit('update:isModal', false); // 부모 컴포넌트로 모달 닫기 이벤트 전송
};
// const usersInfoarr = ref([]);

// 유저 정보
const userId = ref('');
const profileImage = ref('');
const nickname = ref('');
const email = ref('');
const groupName = ref('');
const location = ref('');
const positions = ref([]);
const techStacks = ref([]);

// 유저정보 가져오기
const getUsersInfo = async () => {
  try {
    const res = await getUserInfo(props.user_id);

    if (res.code ==='SUCCESS') {
      console.log("ㅅㄷㄴㅅ");
      profileImage.value = res.result.profileImage;
      nickname.value = res.result.nickname;
      email.value = res.result.email;
      groupName.value = res.result.groupName;
      location.value = res.result.location;
      positions.value = res.result.positions;
      techStacks.value = res.result.techStacks;
    }
    console.log('유저정보', res.result);
    console.log('닉네임:', res.result.nickname)
    console.log("profileImage:", profileImage.value);
    
  } catch (error) {
    console.error('유저 정보 가져오기 실패:', error);
  }
};

// user_id가 변경되면 유저 정보를 다시 가져오기
watchEffect(() => {
  if (props.user_id) {
    getUsersInfo(); // user_id가 있을 때만 호출
  }
});
</script>

<style scoped>
/* 모달 애니메이션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
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
