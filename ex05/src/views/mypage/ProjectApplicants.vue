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

          <tbody v-for="(applicant, index) in applicantsarr" :key="applicant.id" class="text-center hover:bg-gray-100 hover:underline" @click="openModal(applicant, applicant.userId)">
            <tr>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap text-gray-700 cursor-pointer hover:text-gray-400">🔍 {{ applicant.userNickname }}</td>
              <RouterLink :to="`/projectview/${applicant.boardId}`">
                <td class="py-3 px-4 text-sm border-b whitespace-nowrap cursor-pointer hover:text-gray-400" @click="goProject" style="display: block">{{ applicant.boardTitle }}</td>
              </RouterLink>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap cursor-pointer">{{ applicant.positionName }}</td>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap truncate max-w-[500px] overflow-hidden cursor-pointer hover:text-gray-400">
                {{ applicant.applyNote }}
              </td>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap">{{ applicant.applyDate }}</td>
              <td class="py-3 px-4 text-sm border-b whitespace-nowrap text-gray-400">{{ applicant.participationStatus }}</td>
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

          <div class="flex justify-around w-full">
            <div>
              <h2 class="font-bold text-md text-center mb-2">지원자 프로필</h2>
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
                    <div v-if="tech.techStackName?.length === 0" class="text-gray-200 font-bold text-xl">DEVMIX</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col mb-4 gap-2">
              <p class="font-bold">지원 직군</p>
              <p class="text-sm border border-gray-200 rounded-md p-4">{{ selectedApplicant?.positionName }}</p>
              <p class="font-bold">지원 사유 및 한마디</p>
              <p class="text-sm border border-gray-200 h-full rounded-md p-4">{{ selectedApplicant?.applyNote }}</p>
            </div>
          </div>
          <div class="flex justify-center gap-3 mb-4">
            <button type="button" class="border border-gray-300 bg-gray-300 rounded-full py-1 px-3" @click="reject">거절</button>
            <button type="submit" class="border border-[#d10000] bg-[#d10000] text-white rounded-full py-1 px-3" @click="admit">승인</button>
          </div>

          <p class="text-center text-sm text-gray-500 mb-3">승인을 누르시면, 해당 지원자는 정식으로 프로젝트 참가자가 됩니다.</p>
        </div>
      </div>

      <!-- 프로필 모달-->
      <!-- <UserProfile :isModal="isModal" :user_id="user_id" @update:isModal="closeProfileModal" /> -->
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
  boardId: 0,
  userId: '',
  userNickname: '',
  positionName: '',
  applyNote: '',
  participationStatus: ''
});

// 지원자 지원내용 상세 정보 모달
const showModal = ref(false);
const openModal = (applicant, userId) => {
  selectedApplicant.value = applicant; // 클릭한 지원자 정보 모달에 전달
  // console.log('지원자내용에서 userId뽑기',selectedApplicant.value.userId);
  selectedApplicant.value.userId = userId; // 클릭한 유저 아이디 모달에 전달
  // console.log('지원자Id', userId)
  showModal.value = true;
};

// 지원자 승인 모달상태
const isConfirmModal = ref(false);

//지원자 거절 Api
const reject = async () => {
  //console.log('거절 시 지원정보', selectedApplicant.value);

  if (selectedApplicant.value) {
    const { boardId, userNickname, positionName, participationStatus } = selectedApplicant.value;
    // console.log('보드아이디,닉네임,포지션, 승인상태', boardId, userNickname, positionName, participationStatus);

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
  }
};

//지원자 승인 Api
const admit = async () => {
  //console.log('승인 시 지원정보', selectedApplicant.value);

  if (selectedApplicant.value) {
    const { boardId, userNickname, positionName, participationStatus } = selectedApplicant.value;
    // console.log('보드아이디,닉네임,포지션, 승인상태', boardId, userNickname, positionName, participationStatus);

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
};

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
    const res = await getUserInfo(userId);

    if (res.status === 200 && res.data && res.data) {
      profileImage.value = res.data.profileImage;
      nickname.value = res.data.nickname;
      email.value = res.data.email;
      groupName.value = res.data.groupName;
      location.value = res.data.location;
      positions.value = res.data.positions;
      techStacks.value = res.data.techStacks;
    }
    console.log('유저정보', res);
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
  width: 550px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.isVisible {
  display: none;
}
</style>
