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

        <div class="flex flex-col items-center mb-4 gap-2">
          <img v-if="profileImage" :src="profileImage" class="h-20 w-20 m-auto rounded-full object-cover mb-4" />
          <img v-else src="/img/people.png" class="h-20 w-20 rounded-full object-cover mb-4" />
          <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">닉네임</p>
          <span class="text-xl">{{ nickname }}</span>
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
    </transition>
    <!--🙎‍♂️모달 끝-->
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue';
import { getUserInfo } from '@/api/userApi';

const profileImage = ref('');
const nickname = ref('');
const groupName = ref('');
const location = ref('');
const positions = ref([]);
const techStacks = ref([]);

// Props
const props = defineProps({
  isModal: Boolean,
  user_id: Number,
});

// Emits
const emit = defineEmits(["update:isModal"]);

// Close modal
const closeModal = () => {
  emit("update:isModal", false);
};
// Fetch user info
const openProfile = async () => {
  if (!props.user_id) return;

  try {
    const { res } = await getUserInfo();
    profileImage.value = res.profileImage
    nickname.value = res.nickname
    groupName.value = res.groupName 
    location.value = res.location 
    positions.value = res.positions 
    techStacks.value = res.techStacks 
    console.log('나오나' + props.user_id)
  } catch (err) {
    console.error("사용자 정보 불러오기 실패:", err);
  }
};

// Watch for modal open
watch(
  () => props.isModal,
  (newVal) => {
    if (newVal) openProfile();
  }
);
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
