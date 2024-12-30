<template>
  <!--😀개인 정보-->

  <!-- <p @click="getUsersInfo(user_id)">다른사람 프로필보기</p> -->
  <!-- <div v-for="(board, index) in usersInfoarr" :key="index"> -->

  <!--프로필모달-->
  <!-- <transition name="modal" @before-enter="beforeEnter" @enter="enter" @leave="leave"> -->
    <div v-if="props.isModal" class="modal-container" @click.self="closeModal">
      <div class="modal-content">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-xl text-center">프로필</h2>
          <button class="h-4 w-4" @click="closeModal"><img src="/img/x.png" /></button>
        </div>

        <div class="flex flex-col items-center mb-4 gap-2">
          <img v-if="profileImage" :src="profileImage" class="h-20 w-20 m-auto rounded-full object-cover mb-4" />
          <img v-else src="/img/people.png" class="h-20 w-20 rounded-full object-cover mb-4" />
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">닉네임</p>
          <p class="text-xl">{{ nickname }}</p>
        </div>
        <div class="flex flex-col items-center gap-1">
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">소속</p>
          <div v-if="!groupName" class="text-gray-200 font-bold text-xl mb-1">DEVMIX</div>
          <p class="whitespace-nowrap mb-1 text-xl">{{ groupName }}</p>
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">거주 지역</p>
          <div v-if="!location" class="text-gray-200 font-bold text-xl mb-1">DEVMIX</div>

          <p class="whitespace-nowrap mb-1 text-xl">{{ location }}</p>
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">포지션</p>
          <div v-if="!positions || positions.length === 0" class="text-gray-200 font-bold text-xl mb-1">DEVMIX</div>

          <ul class="item-center mb-1">
            <p v-for="(position, index) in positions" :key="index" class="whitespace-nowrap text-center text-xl">
              {{ position }}
            </p>
          </ul>
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">기술 스택</p>
          <div class="flex gap-4 items-center mb-4 flex-wrap">
            <div class="py-2" v-for="tech in techStacks" :key="tech">
              <img :src="tech.imageUrl" class="w-8 h-8" />
              <span class="text-sm py-4">{{ tech.techStackName }}</span>
              <div v-if="tech.techStackName?.length === 0" class="text-gray-200 font-bold text-xl">DEVMIX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--😀개인 정보 끝-->
    <!-- </div> -->
  <!-- </transition> -->
</template>

<script setup>
import { ref, watchEffect } from 'vue';
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

    if (res.status === 200 && res.data && res.data.result) {
      profileImage.value = res.data.result.profileImage;
      nickname.value = res.data.result.nickname;
      email.value = res.data.result.email;
      groupName.value = res.data.result.groupName;
      location.value = res.data.result.location;
      positions.value = res.data.result.positions;
      techStacks.value = res.data.result.techStacks;
    }
    console.log(res.data.result);
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

<style lang="scss" scoped>
// .bounce-enter-active {
//   animation: bounce-in 0.5s;
// }
// .bounce-leave-active {
//   animation: bounce-in 0.5s reverse;
// }
// @keyframes bounce-in {
//   0% {
//     transform: scale(0);
//   }
//   50% {
//     transform: scale(1.25);
//   }
//   100% {
//     transform: scale(1);
//   }
// }
</style>
