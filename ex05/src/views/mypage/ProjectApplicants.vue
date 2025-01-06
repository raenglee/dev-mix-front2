<template>
  <div class="w-4/6 mx-auto mt-20">
    <div class="pt-10 mb-10">
      <p class="font-bold text-2xl mb-4">지원자</p>

      <div class="flex flex-col w-full mb-4">
        <!-- 정렬 필터 -->
        <!-- <div class="flex text-sm text-gray-700 gap-2 mb-4 justify-end">
          <p class="cursor-pointer hover:text-gray-500 transition-colors">신청 순</p>
          <i>|</i>
          <p class="cursor-pointer hover:text-gray-500 transition-colors">닉네임 순</p>
          <i>|</i>
          <p class="cursor-pointer hover:text-gray-500 transition-colors">프로젝트 순</p>
        </div> -->

        <!-- 테이블 -->

        <table class="min-w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
          <thead class="bg-gray-50">
            <tr>
              <th class="border-b text-center p-3 text-gray-800 rounded-tl-lg">닉네임</th>
              <th class="border-b text-center p-3 text-gray-800">프로젝트명</th>
              <th class="border-b text-center p-3 text-gray-800">포지션</th>
              <th class="border-b text-center p-3 text-gray-800">내용</th>
              <th class="border-b text-center p-3 text-gray-800">신청날짜</th>
              <th class="border-b text-center p-3 text-gray-800 rounded-tr-lg">승인 여부</th>
            </tr>
          </thead>

          <!-- 지원자가 없는 경우 -->
          <tbody v-if="applicantsarr.length === 0">
            <tr>
              <td colspan="6" class="text-center text-gray-500 py-8">
                <div class="flex items-center justify-center w-full">프로젝트 지원자가 없습니다.</div>
              </td>
            </tr>
          </tbody>

          <tbody
            v-for="(applicant, index) in applicantsarr"
            :key="applicant.id"
            class="text-center hover:bg-gray-100 hover:underline hover:text-gray-400"
            @click="openModal(applicant, applicant.userId)"
          >
            <tr>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap text-gray-700 cursor-pointer">🔍 {{ applicant.userNickname }}</td>
              <RouterLink :to="`/projectview/${applicant.boardId}`">
                <td class="py-3 px-4 text-sm border-b whitespace-nowrap cursor-pointer" @click="goProject" style="display: block">{{ applicant.boardTitle }}</td>
              </RouterLink>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap cursor-pointer">{{ applicant.positionName }}</td>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap truncate max-w-[500px] overflow-hidden cursor-pointer">
                {{ applicant.applyNote }}
              </td>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap">{{ applicant.applyDate }}</td>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap font-bold">{{ applicant.participationStatus }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--지원한 모달-->
      <div v-if="showModal" class="modal-container" @click.self="closeModal">
        <div class="modal-content">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-xl text-center">지원 상세 내용</h2>
            <button class="h-4 w-4" @click="closeModal"><img src="/img/x.png" /></button>
          </div>

          <div class="flex justify-between w-full">
            <div class="w-72">
              <div class="flex flex-col mb-4">
                <img v-if="selectedApplicant.profileImage" :src="selectedApplicant.profileImage" class="h-20 w-20 rounded-full object-cover m-auto" />
                <img v-else src="/img/people.png" class="h-20 w-20 rounded-full object-cover m-auto" />
                <p class="font-bold text-center">{{ selectedApplicant.nickname }}</p>
                <p class="text-center text-sm text-gray-500">{{ selectedApplicant.email }}</p>
              </div>
              <div class="flex flex-col gap-1">
                <div class="mb-4 flex">
                  <p class="font-bold border rounded-full px-3 py-1 bg-gray-100 border-gray-100 mr-2">소속</p>
                  <p v-if="!selectedApplicant.groupName" class="text-gray-200 font-bold text-lg">DEVMIX</p>
                  <p class="whitespace-nowrap py-1">{{ selectedApplicant.groupName }}</p>
                </div>

                <div class="mb-4 flex">
                  <p class="font-bold border rounded-full px-3 py-1 bg-gray-100 border-gray-100 mr-2">지역</p>
                  <p v-if="!selectedApplicant.location" class="text-gray-200 font-bold text-lg">DEVMIX</p>
                  <p class="whitespace-nowrap py-1">{{ selectedApplicant.location }}</p>
                </div>

                <p class="font-bold border rounded-full px-3 py-1 bg-gray-100 border-gray-100 mb-1">포지션</p>
                <div v-if="selectedApplicant.positions.length === 0" class="text-gray-200 font-bold text-lg ml-3">DEVMIX</div>
                <ul class="mb-1 flex flex-wrap gap-1">
                  <p v-for="(position, index) in selectedApplicant.positions" :key="index" class="whitespace-nowrap mx-2 px-1">
                    {{ position }}
                  </p>
                </ul>
                <p class="font-bold border rounded-full px-3 py-1 bg-gray-100 border-gray-100 mb-1">기술 스택</p>
                <div class="flex gap-4 flex-wrap">
                  <div class="py-1 ml-2" v-for="tech in selectedApplicant.techStacks" :key="tech">
                    <img :src="tech.imageUrl" class="w-8 h-8" />
                    <span class="text-sm">{{ tech.techStackName }}</span>
                  </div>
                  <div v-if="selectedApplicant.techStacks == null || selectedApplicant.techStacks?.length === 0" class="text-gray-200 font-bold text-lg ml-2">DEVMIX</div>
                </div>
              </div>
            </div>

            <div v-if="currentApplicant">
              <div class="flex flex-col mb-4 gap-3 w-80 h-full">
                <p class="font-bold">지원 직군</p>
                <p class="text-sm border border-gray-200 rounded-md p-4">{{ currentApplicant.positionName }}</p>
                <p class="font-bold">지원 사유 및 한마디</p>
                <p class="text-sm border border-gray-200 rounded-md p-4 h-full mb-8">{{ currentApplicant.applyNote }}</p>
              </div>
            </div>
          </div>

          <div v-if="currentApplicant">
            <div class="flex justify-center gap-3 mb-4">
              <button
                type="button"
                class="border border-gray-300 bg-gray-300 rounded-full py-1 px-3"
                @click="reject(currentApplicant.boardId, currentApplicant.positionName, selectedApplicant.nickname)"
              >
                거절
              </button>
              <button
                type="submit"
                class="border border-[#d10000] bg-[#d10000] text-white rounded-full py-1 px-3"
                @click="admit(currentApplicant.boardId, currentApplicant.positionName, selectedApplicant.nickname)"
              >
                승인
              </button>
            </div>
          </div>

          <p class="text-center text-sm text-gray-500 mb-3">승인을 누르시면, 해당 지원자는 정식으로 프로젝트 참가자가 됩니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { admitApplicants, getApplicants } from '@/api/applyApi';
import { useUserStore } from '@/store/userStore';
import { ref, watchEffect } from 'vue';
import { getUserInfo } from '@/api/userApi';

// user_id 가져오기
const useStore = useUserStore();
const applicantsarr = ref([]);

const currentApplicant = ref(null);

// 지원자 정보 Api
const applicants = async () => {
  try {
    const res = await getApplicants(useStore.userId);
    // 데이터 구조 확인 후, applicantsarr에 할당
    if (Array.isArray(res.data.result)) {
      applicantsarr.value = res.data.result;
      console.log('지원자 정보', res.data.result);
    } else {
      console.error('지원자 res, data, result 확인해보기: ', res);
    }
  } catch (error) {
    console.error('지원자 가져오기 에러: ', error);
  }
};

// 지원자 정보
// const selectedApplicant = ref(null);
const selectedApplicant = ref({
  // boardId: 0,
  profileImage: '',
  userId: '',
  nickname: '',
  eamil: '',
  groupName: '',
  location: '',
  positions: '',
  techStacks: '',
  applyNote: ''
  // participationStatus: ''
});

// 지원자 지원내용 상세 정보 모달
const showModal = ref(false);
const openModal = async (applicant, userId) => {
  // selectedApplicant.value = applicant; // 클릭한 지원자 정보 모달에 전달
  // selectedApplicant.value.userId = userId; // 클릭한 유저 아이디 모달에 전달
  showModal.value = true;

  // console.log (userId)

  currentApplicant.value = applicant;
  showModal.value = true;

  const info = await getUsersInfo(userId); // 유저 정보 가져오기
  if (info) {
    selectedApplicant.value = info;
  }

  console.log('신청자정보', info);
};

// 지원자 승인 모달상태
const isConfirmModal = ref(false);

//지원자 거절 Api
const reject = async (boardId, positionName, userNickname) => {
  const data = {
    boardId,
    userNickname,
    positionName,
    participationStatus: '거절'
  };

  try {
    const res = await admitApplicants(data); // API 호출
    if (res.status === 200) {
      alert('신청을 거절하였습니다.');
      isConfirmModal.value = true;
      closeModal(); // 모달 닫기
      applicants(); // 지원자 목록 업데이트
    } else {
      console.error('거절 실패', res);
    }
  } catch (error) {
    console.error('지원자 거절 API 호출 에러', error);
  }
};

//지원자 승인 Api
const admit = async (boardId, positionName, userNickname) => {
  //console.log('승인 시 지원정보', selectedApplicant.value);

  if (selectedApplicant.value) {
    const data = {
      boardId,
      userNickname,
      positionName,
      participationStatus: '승인'
    };

    try {
      const res = await admitApplicants(data);
      if (res.status === 200) {
        isConfirmModal.value = true;
        alert('신청을 승인하였습니다.');
        closeModal(); // 모달 닫기
        applicants();
      } else {
        console.error('승인 실패', res);
      }
    } catch (error) {
      console.error('지원자 승인 API 호출 에러', error);
    }
  }
};

// 지원정보 모달을 닫기 위한 함수
const closeModal = () => {
  showModal.value = false;
  currentApplicant.value = null;
};

// 유저 정보
const userId = ref('');
// const profileImage = ref('');
// const nickname = ref('');
// const email = ref('');
// const groupName = ref('');
// const location = ref('');
// const positions = ref([]);
// const techStacks = ref([]);

// 유저정보 가져오기
const getUsersInfo = async (userId) => {
  try {
    const res = await getUserInfo(userId);

    // if (res.status === 200 && res.data && res.data) {
    //   profileImage.value = res.data.profileImage;
    //   nickname.value = res.data.nickname;
    //   email.value = res.data.email;
    //   groupName.value = res.data.groupName;
    //   location.value = res.data.location;
    //   positions.value = res.data.positions;
    //   techStacks.value = res.data.techStacks;
    // }
    // console.log('유저정보', res.data);
    return res.result;
  } catch (error) {
    console.error('유저 정보 가져오기 실패:', error);
  }
};

// user_id가 변경되면 유저 정보를 다시 가져오기
watchEffect(() => {
  if (userId.value && userId.value !== '') {
    getUsersInfo(); // userId가 비어 있지 않을 때만 호출
  }
  applicants();
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
  width: 750px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.isVisible {
  display: none;
}
</style>
