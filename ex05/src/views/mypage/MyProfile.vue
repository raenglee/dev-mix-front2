<template>
  <!--😀개인 정보-->
  <div class="m-auto w-full flex flex-col">
    <div class="m-auto flex flex-col justify-center text-center border border-gray-200 p-3 mb-2 w-full rounded-xl bg-gray-50">
      <img v-if="useStore.profileImage" :src="useStore.profileImage" class="h-20 w-20 m-auto rounded-full" />
      <!-- <img class="h-20 w-20 m-auto" /> -->
      <img v-else src="/img/people.png" class="h-20 w-20 m-auto rounded-full object-cover" />
      <p>{{ useStore.nickname }}님</p>
      <p class="text-sm text-gray-400">{{ useStore.email }}</p>
      <div class="flex justify-center text-center py-3">
        <RouterLink to="/myprofileedit"><button class="border bg-white border-gray-300 rounded-md py-1 px-3 mx-1">프로필 수정</button> </RouterLink>
        <button class="border border-gray-300 bg-white rounded-md py-1 px-2">공유</button>
      </div>
    </div>

    <div class="mt-4 w-full flex flex-col">
      <!-- flex 컨테이너로 2개 항목을 가로로 정렬 -->
      <div class="m-auto flex justify-center text-cente p-3 w-full rounded-xl gap-5">
        <!-- 첫 번째 카드: 소속 -->
        <div class="border bg-gray-50 rounded-2xl p-4 w-1/2">
          <!-- 소속 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="top-4 flex items-center justify-center">
            <div class="text-lg font-bold px-2 rounded-full text-gray-800">소속</div>
          </div>
          <!-- useStore.groupName 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="text-l mb-2 text-gray-800 flex justify-center items-center pt-5">
            <span v-if="useStore.groupName">{{ useStore.groupName }}</span>
            <span v-else class="text-gray-200 font-bold text-xl">DEVMIX</span>
          </div>
        </div>
        <div class="border bg-gray-50 rounded-2xl p-4 w-1/2">
          <!-- 지역 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="top-4 flex items-center justify-center">
            <div class="text-lg font-bold px-2 rounded-full text-gray-800">지역</div>
          </div>

          <!-- useStore.location 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="text-l mb-2 text-gray-800 flex justify-center items-center pt-5">
            <span v-if="useStore.location">{{ useStore.location }}</span>
            <span v-else class="text-gray-200 font-bold text-xl">DEVMIX</span>
          </div>
        </div>
      </div>

      <div class="m-auto flex justify-center text-cente p-3 mb-2 w-full rounded-xl gap-5">
        <!-- 첫 번째 카드: 소속 -->
        <div class="border bg-gray-50 rounded-2xl p-4 w-1/2">
          <!-- 소속 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="top-4 flex items-center justify-center">
            <div class="px-2 text-lg font-bold rounded-full text-gray-800">포지션</div>
          </div>
          <!-- useStore.groupName 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="text-l mb-2 text-gray-800 flex justify-center items-center pt-5">
            <template v-if="userProfile != null">
              <span class="px-2" v-for="(position, index) in myPosition" :key="index">
                {{ position }}
              </span>
            </template>
            <template v-else>
              <span class="text-gray-200 font-bold text-xl">DEVMIX</span>
            </template>
          </div>
        </div>

        <div class="border bg-gray-50 rounded-2xl p-4 w-1/2">
          <!-- 소속 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="top-4 flex items-center justify-center">
            <div class="px-2 text-lg font-bold rounded-full text-gray-800">기술 스택</div>
          </div>
          <!-- useStore.groupName 텍스트 세로 중앙 정렬 및 가로 중앙 정렬 -->
          <div class="text-l mb-2 text-gray-800 flex justify-center items-center pt-5">
              <div class="flex space-x-5 justify-center text-center items-center">
                <div class="py-2" v-for="(skill, index) in mySkills" :key="index">
                  <span class="text-center text-sm py-4">
                    <img :src="skill.imageUrl" class="w-10 h-10" />
                    {{ skill.techStackName }}</span
                  >
                </div>
              </div>
              <div v-if="userProfile = null">
                <span class="text-gray-200 font-bold text-xl">DEVMIX</span>
              </div>
          </div>
        </div>
      </div>
    </div>
    <p class="text-xs text-gray-500 hover:text-gray-700 text-right pr-4">회원탈퇴</p>
  </div>
  <!--😀개인 정보 끝-->
</template>

<script setup>
// import { getPositions, getTechstacks } from '@/api/projectApi';
import { loginUsers } from '@/api/loginApi';
import { ref, watchEffect } from 'vue';
import { useUserStore } from '@/store/userStore';

const useStore = useUserStore();
const userProfile = ref(null);
const mySkills = ref([]); // 기술들의 배열const myPosition = ref([]);
const myPosition = ref([]);

// 사용자 정보 API 호출
const loadUserProfile = async () => {
  try {
    const profile = await loginUsers(); // API로부터 사용자 프로필 정보 가져오기
    userProfile.value = profile.result; // API에서 받은 데이터를 userProfile에 저장
    // console.log('통신하고 나서 출력' + JSON.stringify(userProfile.value));

    // 원래 있는 기술 넣기
    const updatedTechStacks = userProfile.value.techStacks.map(({ techStackName, techStackImageUrl }) => ({
      techStackName,
      imageUrl: techStackImageUrl
    }));

    // 원래 있는 포지션 넣기
    profile.result.positions.forEach((temp) => {
      myPosition.value.push(temp.positionName);
    });

    mySkills.value = updatedTechStacks;

    const excludedTechStacks = [];
    profile.result.techStacks.map((techStacks) => {
      excludedTechStacks.push(techStacks.techStackName);
    });
  } catch (error) {
    console.error('프로필 정보를 불러오는 데 실패했습니다.', error);
  }
};

watchEffect(() => {
  loadUserProfile();
});
</script>

<style lang="scss" scoped></style>
