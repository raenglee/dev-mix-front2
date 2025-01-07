<template>
  <div class="m-auto w-full">
    <p class="text-lg font-bold mb-4">보낸 신청</p>

    <table class="min-w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
      <thead class="bg-gray-50">
        <tr>
          <th class="border-b text-center p-3 text-gray-800 rounded-tl-lg">상태</th>
          <th class="border-b text-center p-3 text-gray-800">프로젝트명</th>
          <th class="border-b text-center p-3 text-gray-800">지원 포지션</th>
          <th class="border-b text-center p-3 text-gray-800">지원 날짜</th>
          <!-- <th class="border-b text-center p-3 text-gray-800 rounded-tr-lg">신청 취소</th> -->
        </tr>
      </thead>

      <tbody>
        <tr v-if="myAppliesarr.length === 0" class="text-ml text-center text-gray-500 py-8" style="height: 100px">
          <td colspan="4" class="text-center text-gray-500 py-8">
            <div class="flex items-center justify-center w-full">작성한 신청이 없습니다.</div>
          </td>
        </tr>
      </tbody>

      <tbody class="text-gray-500">
        <tr v-for="(myApplies, index) in myAppliesarr" :key="index" class="cursor-pointer hover:bg-gray-50">
          <td
            class="flex py-3 px-4 justify-center items-center text-sm border-b whitespace-nowrap hover:text-gray-400 "
            @click="openModal(myApplies)"
            :class="{
              'bg-[#d10000]': myApplies.participationStatus === 'YES',
              'bg-gray-500': myApplies.participationStatus === 'NO',
              'bg-yellow-500': myApplies.participationStatus === 'UNKNOWN'
            }"
          >
            <div class="w-2/3 text-[15px] text-gray-800 text-center">{{ myApplies.participationStatus }}</div>
          </td>

          <td class="py-3 px-4 text-sm border-b text-center whitespace-nowrap hover:text-gray-400" @click="openModal(myApplies)">{{ myApplies.boardTitle }}</td>

          <td class="py-3 px-4 text-sm border-b text-center whitespace-nowrap hover:text-gray-400" @click="openModal(myApplies)">{{ myApplies.positionName }}</td>

          <td class="py-3 px-4 text-sm border-b text-center whitespace-nowrap hover:text-gray-400" @click="openModal(myApplies)">{{ myApplies.applyDate }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 지원 모달 -->
    <div v-if="showModal" class="modal-container" @click.self="closeModal">
      <div class="modal-content">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-xl text-center">지원 프로젝트 상세 내용</h2>
        </div>
        <div class="flex flex-col mb-4 gap-2">
          <div class="flex flex-row justify-between items-center">
            <p class="font-bold">지원 프로젝트</p>
            <p class="text-center text-xs pr-2 text-gray-500 cursor-pointer hover:underline" @click="viewPage(selectedApply.boardId)">프로젝트 확인</p>
          </div>

          <p class="text-sm bg-gray-100 rounded-lg p-4">{{ selectedApply.boardTitle }}</p>
          <p class="font-bold">지원 포지션</p>
          <p class="text-sm bg-gray-100 rounded-lg p-4">{{ selectedApply.positionName }}</p>
          <p class="font-bold">지원 사유 및 한마디</p>
          <p class="text-sm bg-gray-100 rounded-lg p-4">{{ selectedApply.note }}</p>
        </div>
        <div class="flex justify-center gap-3 mb-4">
          <button type="submit" class="border border-[#d10000] bg-[#d10000] text-white rounded-full py-1 px-3" @click="closeModal">확인</button>
        </div>

        <p class="text-center text-sm text-gray-500 mb-3">승인을 누르시면, 해당 지원자는 정식으로 프로젝트 참가자가 됩니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMyApplies } from '@/api/applyApi';
import { useUserStore } from '@/store/userStore';
import { ref, watchEffect } from 'vue';
import router from '@/router';

const useStore = useUserStore();
const myAppliesarr = ref([]);
const showModal = ref(false);
const selectedApply = ref(null); // 클릭된 항목을 저장할 변수

// 내가 지원한 정보 Api
const myApplies = async () => {
  try {
    const res = await getMyApplies(useStore.userId);
    console.log('지원한 내용들', res.data.result);

    if (Array.isArray(res.data.result)) {
      myAppliesarr.value = res.data.result;
      console.log('모달내 내용', myAppliesarr.value);
    } else {
      console.error('지원자 res, data, result 확인해보기: ', res);
    }
  } catch (error) {
    console.error('지원자 가져오기 에러: ', error);
  }
};

myApplies();

// 각 게시글과 연결
const viewPage = (board_id) => {
  const data = { name: 'projectview', params: { board_id: board_id } };
  router.push(data);
};

// 클릭된 항목의 정보를 받아서 모달을 열기
const openModal = (myApplies) => {
  selectedApply.value = myApplies; // 선택된 항목을 selectedApply에 저장
  showModal.value = true; // 모달 열기
};

// 게시판 프로필 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

watchEffect(() => {
  myApplies();
});
</script>

<style lang="scss" scoped></style>
