<template>
  <!--😀개인 정보-->

  <!-- <p @click="getUsersInfo(user_id)">다른사람 프로필보기</p> -->
  <!-- <div v-for="(board, index) in usersInfoarr" :key="index"> -->

  <!--지원모달-->
  <div v-if="showModal" class="modal-container" @click.self="closeModal">
    <div class="modal-content">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-xl text-center">프로필</h2>
        <button class="h-4 w-4" @click="closeModal"><img src="/img/x.png" /></button>
      </div>
      <img v-if="profileImage" :src="profileImage" class="h-20 w-20 m-auto rounded-full" />
      <img v-else src="/img/people.png" class="h-8 w-8 rounded-full" />

      <div class="flex flex-col">
        <div class="flex mb-4 gap-2">
          <p class="font-bold text-center whitespace-nowrap">닉네임</p>
          <p class="font-bold whitespace-nowrap">소속</p>
          <p class="whitespace-nowrap">소속</p>
          <p class="font-bold whitespace-nowrap">거주 지역</p>
          <p class="whitespace-nowrap">온라인 등</p>
        </div>
        <p class="font-bold whitespace-nowrap">포지션</p>
        <p class="whitespace-nowrap">선택한 포지션</p>
        <p class="font-bold whitespace-nowrap">기술 스택</p>
        <p class="whitespace-nowrap">ㅎㅎ</p>
      </div>
    </div>
  </div>
  <!--😀개인 정보 끝-->
  <!-- </div> -->
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { getUserInfo } from '@/api/userApi';

// const props = defineProps({
  // isModal: Boolean, // 모달 가시성 상태
  // user_id: userId // 유저 ID
// });

// const emit = defineEmits(['update:isModal']);

// const closeModal = () => {
//   emit('update:isModal', false);  // 부모 컴포넌트로 모달 닫기 이벤트 전송
// };

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
    console.log('유저아이디', props.user_id);
    const res = await getUserInfo(props.user_id);

    if (res.data) {
      profileImage.value = res.data.profileImage;
      nickname.value = res.data.nickname;
      email.value = res.data.email;
      groupName.value = res.data.groupName;
      location.value = res.data.location;
      positions.value = res.data.positions;
      techStacks.value = res.data.techStacks;
    }

    console.log(res.data)

    // if (Array.isArray(res.data.result)) {
    //   usersInfoarr.value = res.data.result;
    // } else {
    //   console.error('유저정보 가져오기 배열이아님', res);
    // }
  } catch (error) {
    console.error('유저 정보 가져오기 실패:', error);
  }
};

// 모달을 열기 위한 함수
// const openProfile = () => {
//   // 클릭한 직군명 할당
//   // positionName.value = position;
//   showModal.value = true;
// };

// 모달을 닫기 위한 함수
const closeModal = () => {
  showModal.value = false;
};

watchEffect(() => {
  getUsersInfo();
});
</script>
