<template>
  <!--😀개인 정보-->

  <p @click="openProfile">프로필보기</p>
  <!-- <div v-for="(board, index) in usersInfoarr" :key="index"> -->
    
    <!--지원모달-->
  <div v-if="showModal" class="modal-container" @click.self="closeModal">
    <div class="modal-content">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-xl text-center">지원 하시겠습니까?</h2>
        <button class="h-4 w-4" @click="closeModal"><img src="/img/x.png" /></button>
      </div>
      <div class="flex flex-col mb-4 gap-2">
        <label for="position" class="font-bold">지원 직군</label>
        <!-- <p class="text-sm bg-gray-100 rounded-lg p-4 font-bold">{{ positionName }}</p> -->
        <label for="note" class="font-bold">지원 사유 및 한마디</label>
        <textarea id="note" v-model="note" placeholder="지원 사유 및 한마디"></textarea>
      </div>
      <div class="flex justify-center gap-3 mb-4">
        <button type="button" class="border border-gray-300 bg-gray-300 rounded-full py-1 px-3 w-20" @click="closeModal">아니오</button>
        <button class="border border-[#d10000] bg-[#d10000] text-white rounded-full py-1 px-3 w-20" @click="confirmSubmit">예</button>
      </div>
      <p class="text-center text-xs text-gray-500 mb-3">예를 누르시면, 정보제공 / 유의사항에 동의 한 것으로 간주합니다.</p>
      <h3 class="text-sm text-gray-700 font-bold mb-2">유의사항</h3>
      <ul class="text-xs text-gray-400 flex flex-col gap-1">
        <li>프로젝트 리더에게 가입하신 이메일 정보가 제공됩니다.</li>
        <li>프로젝트에서 작업한 저작권에 프로젝트에 귀속됩니다.</li>
        <li>프로젝트 분쟁사항은 데브믹스에서 책임지지 않습니다.</li>
        <li>리더가 14일동안 승인하지 않으면 자동 취소됩니다.</li>
      </ul>
    </div>
  </div>

    <div class="m-auto w-full flex flex-col">
      <div class="m-auto flex flex-col justify-center text-center border border-gray-200 p-3 mb-2 w-full rounded-xl">
        <img v-if="useStore.profileImage" :src="useStore.profileImage" class="h-20 w-20 m-auto" />
        <!-- <img class="h-20 w-20 m-auto" /> -->

        <p>{{ useStore.nickname }}님</p>
        <p>{{ useStore.email }}</p>
        <div class="flex justify-center text-center py-3">
          <button class="border border-gray-300 rounded-md py-1 px-2">공유</button>
        </div>
      </div>
      <div class="flex flex-col justify-center text-center">
        <h2 class="font-bold text-xl">소속</h2>
        <div class="py-2">{{ useStore.groupName }}</div>
        <h2 class="font-bold text-xl">포지션</h2>
        <!-- <li class="py-2" v-for="user in useStore.data" :key="user.id">
        {{ data.positionList }}
      </li> -->
        <h3 class="font-bold text-xl">지역</h3>
        <div class="py-2">{{ useStore.location }}</div>
        <h2 class="font-bold text-xl">기술 스택</h2>
        <li class="py-2" v-for="tech in techStacks" :key="tech">
          <img :src="tech.imageUrl" class="w-10 h-10" />
          <span class="text-sm py-4">{{ tech.techStackName }}</span>
        </li>
      </div>
      <!--😀개인 정보 끝-->
    </div>
  <!-- </div> -->
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useUserStore } from '@/store/userStore';
import { getUserInfo } from '@/api/userApi';

const useStore = useUserStore();
const techStacks = ref([]);
const positions = ref([]);
const usersInfoarr = ref([]);

// 유저정보 가져오기
const getUsersInfo = async () => {
  try {
    const res = await getUserInfo();
    if (Array.isArray(res.data.result)) {
      usersInfoarr.value = res.data.result;
    } else {
      console.error('분야별 모집 인원 배열 저장 에러', res);
    }
  } catch (error) {
    console.error('실패:', error);
  }
};

// 모달의 가시성 상태를 제어하는 변수
const showModal = ref(false);

// 모달을 열기 위한 함수
const openProfile = () => {
  // 클릭한 직군명 할당
  // positionName.value = position;
  showModal.value = true;
};

// 모달을 닫기 위한 함수
const closeModal = () => {
  showModal.value = false;
};

watchEffect(() => {
  getUsersInfo;
});
</script>

<style lang="scss" scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

textarea {
  height: 120px;
  resize: none;
  overflow-y: auto;
}

.isVisible {
  display: none;
}
</style>
