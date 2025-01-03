<template>
  <section class="container mx-auto w-4/6 mt-20">
    <form @submit.prevent="handleSubmit" class="gap-y-5 py-10">
      <div class="justify-center items-center text-center space-y-3 pb-8">
        <p class="border-2 text-gray-700 border-[#d10000] rounded-full text-lg px-4 text-center m-auto inline-block">
          {{ recruitmentStatus }}
        </p>
        <h1 class="text-center font-bold text-2xl">{{ title }}</h1>
        <p class="text-gray-500 text-l text-right mr-10">조회수: {{ viewCount }}</p>
        <div class="my-3 mb-20">
          <hr class="border-t-4 border-[#d10000]" />
        </div>
      </div>

      <!--글 상세 박스-->
      <!-- 프로젝트 소개 부분 (왼쪽) -->
      <div class="flex w-full">
        <div class="w-2/3 mr-10">
          <h1 class="font-bold text-xl border rounded-full px-3 py-1 mb-4 bg-gray-100 border-gray-100">프로젝트 소개</h1>
          <p class="py-2 px-1">{{ content }}</p>
          <div v-for="image in files" :key="image" class="mb-10">
            <img :src="image.imageUrl" class="w-full h-auto" />
          </div>
        </div>
        <!--상세정보 스크롤 따라 내려오도록-->
        <div class="sticky top-[100px] p-8 mb-10 bg-white text-gray-700 rounded border shadow-md w-96 h-[calc(100%-100px)] right-0">
          <div class="flex flex-col flex-wrap gap-y-4">
            <div @click.stop="openProfile(user_id)" class="flex flex-col cursor-pointer text-center m-auto">
              <img v-if="profileImage" :src="profileImage" class="h-20 w-20 rounded-full object-cover mb-1" />
              <img v-else src="/img/people.png" class="h-20 w-20 rounded-full object-cover mb-1" />
              <p class="text-lg font-bold hover:underline hover:text-[#7371fc]">{{ nickname }}</p>
            </div>

            <hr />

            <div class="flex flex-wrap">
              <p for="region" class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">지역 / 구분</p>
              <p class="py-1 pl-4 text-lg">{{ location }}</p>
              <!-- 지역 정보 표시 -->
            </div>
            <div class="flex flex-wrap">
              <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">진행 기간</p>
              <p class="py-1 pl-4 text-lg">{{ projectPeriod }}</p>
            </div>
            <div class="flex flex-wrap">
              <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">모집 마감일</p>
              <p class="py-1 pl-4 text-lg">{{ endDate }}</p>
            </div>

            <div class="flex flex-col flex-wrap">
              <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">기술 / 언어</p>
              <div class="flex flex-wrap gap-x-2">
                <div class="pt-4" v-for="tech in techStacks" :key="tech.techStackName">
                  <div class="flex items-center px-2 py-1 border rounded-full">
                    <img :src="tech.imageUrl" class="w-8 h-8 object-cover bg-white rounded-full" />
                    <span class="text-sm text-gray-700 font-bold pl-1">{{ tech.techStackName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col flex-wrap">
              <p class="font-bold text-lg border rounded-full px-3 py-1 bg-gray-100 border-gray-100">모집 현황</p>

              <div class="flex flex-col w-full flex-wrap">
                <div v-for="(position, index) in positions" :key="index">
                  <div class="flex justify-between pt-4 px-5">
                    <p class="">{{ position.positionName }}</p>
                    <p class="">{{ position.currentCount }}/{{ position.requiredCount }}</p>
                  </div>
                </div>
                <button
                  v-if="!(nickname == loggedInUserNickname) && !isPending"
                  @click="openApplicant"
                  class="border whitespace-nowrap mt-4 p-2 rounded-lg font-bold border-[#d10000] bg-[#d10000] text-white hover:border-gray-200 hover:bg-white hover:text-gray-700"
                >
                  지원
                </button>

                <button v-if="isPending && nickname !== loggedInUserNickname" class="border font-bold border-gray-200 whitespace-nowrap mt-4 p-2 bg-gray-200 item-center cursor-not-allowed rounded-lg">
                  승인 대기
                </button>

                <button
                  v-if="nickname == loggedInUserNickname"
                  @click="goToProjectApp"
                  class="border font-bold text-sm text-white bg-[#7371fc] border-[#7371fc] whitespace-nowrap mt-4 p-2 hover:border-gray-200 hover:bg-white hover:text-gray-700 rounded-lg"
                >
                  지원자 확인하기
                </button>

\              </div>
            </div>
          </div>
        </div>
      </div>
      <!--글 박스 끝-->

      <div>
        <hr class="border-t-4 border-[#d10000]" />
      </div>
      <div class="flex justify-between my-5 mx-7">
        <RouterLink to="/"><button class="border border-gray-200 rounded-full px-4 py-1 text-sm hover:bg-gray-200" @click="goToList">목록</button></RouterLink>
        <div class="space-x-3">
          <button v-if="nickname == loggedInUserNickname" class="border border-gray-200 rounded-full px-4 py-1 text-sm hover:bg-[#d10000] hover:text-white hover:border-[#d10000]" @click="doUpdate">
            수정
          </button>
          <button v-if="nickname == loggedInUserNickname" class="border border-gray-200 rounded-full px-4 py-1 text-sm hover:bg-[#d10000] hover:text-white hover:border-[#d10000]" @click="doDelete">
            삭제
          </button>
        </div>
      </div>
      <!-- 댓글 작성 -->
      <div class="ml-30 justify-center items-center w-full">
        <div class="flex items-center pt-3">
          <div class="flex items-center w-8 h-8">
            <img v-if="useStore.profileImage" :src="useStore.profileImage" class="h-8 w-8 rounded-full object-cover" />
            <img v-else src="/img/people.png" class="h-8 w-8 rounded-full object-cover" />
          </div>
          <p class="ml-3">{{ useStore.nickname }}</p>
        </div>
        <!--댓글 입력창-->
        <div class="flex items-center w-full">
          <div class="my-6 mx-7 justify-center" style="width: 90%">
            <textarea v-model="commentContent" class="w-full p-3 h-20 border border-gray-200 rounded-md focus:outline-none ring-gray-200 resize-none bg-gray-100" placeholder="250자 제한"></textarea>
          </div>
          <div>
            <button class="border border-gray-200 rounded-md h-20 w-20 px-2 text-base hover:bg-gray-100" @click="commentsave">등록</button>
          </div>
        </div>
        <!--댓글목록-->
        <div class="my-6 mx-7 justify-center flex flex-col gap-5">
          <div v-for="comment in comments" :key="comment.id" class="">
            <!-- 댓글 내용 -->
            <div class="flex mx-2 mb-4">
              <div class="flex items-center cursor-pointer" @click.stop="openCommentProfile(comment.userId)">
                <img v-if="comment.userProfileImage" :src="comment.userProfileImage" class="h-8 w-8 rounded-full object-cover" />
                <img v-else src="/img/people.png" class="h-8 w-8 rounded-full object-cover" />
                <p class="font-semibold ml-2 text-gray-800">{{ comment.userNickName }}</p>
              </div>
            </div>

            <!--댓글 수정 시-->
            <div v-if="!comment.isEditing">
              <div class="flex justify-between">
                <!-- 댓글 수정시 내용 -->
                <p class="text-gray-800 ml-4">{{ comment.content }}</p>
                <div class="mr-4">
                  <button v-if="comment.userNickName == loggedInUserNickname" class="text-sm hover:underline ml-2" @click="startEditing(comment)">수정</button>
                  <button v-if="comment.userNickName == loggedInUserNickname" class="text-sm hover:underline ml-2" @click="commentDelete(comment.commentId)">삭제</button>
                </div>
              </div>
              <p class="text-xs mt-3 mb-4 mx-2 ml-4 text-gray-500">{{ comment.lastModifiedAt }}</p>
            </div>

            <div v-else>
              <div class="flex items-center mx-2 mb-4">
                <textarea v-model="comment.newContent" class="p-3 h-[10px] w-full border border-gray-200 rounded-md focus:outline-none ring-gray-100 resize-none bg-gray-100"></textarea>
              </div>
              <div class="flex justify-between pb-4">
                <p class="items-start text-xs mb-4 mx-2 ml-4 text-gray-500">{{ comment.lastModifiedAt }}</p>
                <div class="mr-4 items-end">
                  <button @click="updatecancle" class="ml-4 text-sm hover:underline text-gray-500">취소</button>
                  <button @click="commentupdate(comment.commentId)" class="ml-4 border border-gray-200 rounded-md h-10 w-20 px-2 text-base hover:bg-gray-100">수정</button>
                </div>
              </div>
            </div>
            <div>
              <hr class="border-t border-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </form>
  </section>
  <!-- </div> -->

  <!--지원모달-->
  <div v-if="applicationModal" class="modal-container" @click.self="closeApplicant">
    <div class="modal-content">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-xl text-center">지원 하시겠습니까?</h2>
        <button class="h-4 w-4" @click="closeApplicant"><img src="/img/x.png" /></button>
      </div>
      <div class="flex flex-col mb-4 gap-2">
        <label for="position" class="font-bold">지원 직군</label>
        <div class="relative">
          <select
            v-model="positionName"
            class="w-full h-12 px-4 pr-10 border border-gray-300 rounded-full bg-white text-gray-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 appearance-none transition"
          >
            <option disabled value="">지원할 포지션을 선택하세요</option>
            <option v-for="(position, index) in positions" :key="index" :value="position.positionName">
              {{ position.positionName }}
            </option>
          </select>
          <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>

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

  <!--게시글 작성자 프로필-->
  <UserProfile :isModal="UserProfileModal" :user_id="user_id" @update:isModal="closeProfileModal" />
  <!--댓글 작성자 프로필-->
  <UserProfile :isModal="CommentModal" :user_id="commentUserId" @update:isModal="closeCommentProfileModal" />

  <!-- 승인대기 모달 -->
  <div v-if="isConfirmModal" class="modal-container" @click.self="closeConfirmModal">
    <div class="bg-white p-4 rounded-xl shadow-xl">
      <h2 class="font-bold text-xl flex justify-center text-center mb-4">지원이 완료되었습니다!</h2>
      <p class="text-gray-800 text-sm mb-4">작성자가 승인하면 프로젝트에 참가하게 됩니다.</p>
      <div class="flex justify-center">
        <button @click="closeConfirmModal" class="font-bold text-center border bg-white rounded-md py-1 px-3 hover:bg-gray-200">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getProjectView, getCommentsView, saveComments, deleteProject, deleteComments, updateComments } from '@/api/projectApi';
import router from '@/router';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { applyProject } from '@/api/projectApi'; // API 임포트
import { useUserStore } from '@/store/userStore';
import UserProfile from '../Component/UserProfile.vue';

const useStore = useUserStore();
const route = useRoute();

// 로그인된 사용자 정보 (예: useStore 또는 localStorage에서 가져오는 값)
const loggedInUserNickname = ref(useStore.nickname);

//게시글 정보
const title = ref('');
const location = ref('');
const endDate = ref('');
const content = ref('');
const projectPeriod = ref('');
const viewCount = ref('');
const nickname = ref('');
const profileImage = ref('');
const techStacks = ref([]);
const positions = ref([]);
const recruitmentStatus = ref('');
const user_id = ref('');
const files = ref([]);

//게시글 가져오기
watchEffect(async () => {
  const res = await getProjectView(route.params.board_id);
  if (res.status == 200) {
    // console.log('게시글 정보', res.data.result);
    title.value = res.data.result.title;
    content.value = res.data.result.content;
    location.value = res.data.result.location;
    endDate.value = res.data.result.endDate;
    projectPeriod.value = res.data.result.projectPeriod;
    viewCount.value = res.data.result.viewCount;
    nickname.value = res.data.result.nickname;
    profileImage.value = res.data.result.profileImage;
    techStacks.value = res.data.result.techStackDtoList;
    positions.value = res.data.result.positionDtoList;
    recruitmentStatus.value = res.data.result.recruitmentStatus;
    // console.log('기술스택확인', res.data.result.techStackDtoList);
    // console.log('포지션 배열 확인', res.data.result.positionDtoList);
    // console.log('이미지', res.data.result.imageUrl);
    user_id.value = res.data.result.userId;
    files.value = [{ imageUrl: res.data.result.imageUrl }];
  } else {
    alert('데이터연결안됨', res.response.data.message);
  }
});

//프로젝트지원으로 이동
const goToProjectApp = () => {
  router.push({ name: 'projectapplicants' });
};

// 게시글 수정
const doUpdate = async () => {
  router.push({ name: 'projectupdate' });
};

// 게시글 삭제
const doDelete = async () => {
  const isConfirmed = window.confirm('프로젝트를 삭제하시겠습니까?');
  if (isConfirmed) {
    try {
      const res = await deleteProject(route.params.board_id);
      if (res.status === 200) {
        alert('프로젝트 구인글이 삭제되었습니다.');
        router.push({ name: 'projectlist' });
      } else {
        alert('에러: ' + res.data);
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  } else {
    //아무것도 하지않으므로 빈 상태
  }
};

const comments = ref([]);

// 댓글 데이터를 가져오는 함수
watchEffect(async () => {
  const res = await getCommentsView(route.params.board_id);
  if (res.status === 200 && res.data.result) {
    comments.value = res.data.result; // 댓글 데이터 배열을 할당
  }
  // console.log('댓글값 comments.value:', comments.value);
});

// 댓글 작성
const commentContent = ref('');
const board_id = ref(route.params.board_id);

const commentsave = async () => {
  const data = {
    content: commentContent.value
  };
  // console.log('댓글 내용', JSON.stringify(data));
  const res = await saveComments(board_id.value, data);
  if (res.status === 200) {
    alert('댓글이 작성되었습니다.');
    commentContent.value = '';
    const updatedComments = await getCommentsView(board_id.value);
    if (updatedComments.status === 200) {
      comments.value = updatedComments.data.result; // 댓글 목록 갱신
    }
    return;
  }
  if (res.status === 401) {
    alert('로그인이 필요합니다.');
    return;
  }
  if (res.status === 400) {
    alert('내용을 입력하세요.');
    return;
  }
  alert('에러: ' + res.data);
};
// console.log('useStore.nickname.value: ' + useStore.nickname);

// 댓글 수정시 텍스트박스로 변경
const startEditing = (comment) => {
  comment.isEditing = true;
  comment.newContent = comment.content; // 기존 댓글 내용을 newContent에 설정
};

// 댓글 수정
const commentupdate = async (commentId) => {
  const comment = comments.value.find((c) => c.commentId === commentId);
  // console.log('댓글', comments.value);
  // console.log('댓글id',commentId)
  const data = {
    id: commentId,
    content: comment.newContent
  };

  const res = await updateComments(board_id.value, data);
  if (res.status === 200) {
    alert('댓글이 수정되었습니다.');
    const updatedComments = await getCommentsView(board_id.value);
    if (updatedComments.status === 200) {
      comments.value = updatedComments.data.result; // 댓글 목록 갱신
    }
    return;
  }
  if (res.status === 400) {
    alert('내용을 입력하세요.');
    return;
  }
  alert('에러: ' + res.data);
};

const updatecancle = async () => {
  comments.value.forEach((comment) => {
    comment.isEditing = false;
  });
};

// 댓글 삭제
const commentDelete = async (id) => {
  // console.log('댓글 id:', id);
  // console.log('보드 id:', route.params.board_id);
  const isConfirmed = window.confirm('댓글을 삭제 하시겠습니까?');
  if (isConfirmed) {
    try {
      const res = await deleteComments(route.params.board_id, id);
      if (res.status === 200) {
        alert('댓글이 삭제되었습니다.');
        const updatedComments = await getCommentsView(route.params.board_id);
        if (updatedComments.status === 200) {
          comments.value = updatedComments.data.result; // 댓글 목록 갱신
        }
      } else {
        alert('에러: ' + res.data);
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  } else {
    //아무것도 하지않으므로 빈 상태
  }
};

//지원 모달

// 지원 직군을 저장하는 변수
const positionName = ref('');
// 완료 모달 표시 여부 제어
const isConfirmModal = ref(false);

//지원기능
const isPending = ref(false); // 지원 상태 변수
const note = ref('');

// 지원 API 호출
const confirmSubmit = async () => {
  try {
    const data = {
      positionName: positionName.value,
      note: note.value
    };
    console.log('isPending:', isPending.value);

    const res = await applyProject(route.params.board_id, data);
    console.log('보드아이디,내용', route.params.board_id, data);
    console.log('지원하기 모달', res);

    if (res.status === 200) {
      isPending.value = true;
      console.log('isPending:', isPending.value);
      closeApplicant(); // 기존 지원 모달 닫기
      isConfirmModal.value = true; // 완료 모달 열기
    } else {
      alert('지원에 실패했습니다.');
    }
  } catch (error) {
    console.error('지원 중 오류 발생:', error);
    alert('지원 중 오류가 발생했습니다.');
  }
};

// 지원 모달의 가시성 상태를 제어하는 변수
const applicationModal = ref(false);
// 지원 모달을 열기 위한 함수
const openApplicant = () => {
  applicationModal.value = true;
};

// 유저프로필 모달
const UserProfileModal = ref(false); // 모달의 가시성 (flase-안보임)

// 게시판 댓글 유저프로필 모달
const CommentModal = ref(false);
const commentUserId = ref(null);

// 게시글에서 프로필 클릭 시 모달을 열고 user_id를 설정하는 함수
const openProfile = (userId) => {
  user_id.value = userId;
  UserProfileModal.value = true; // 모달 열기
  // console.log('유저ID', user_id.value);
};

// 댓글에서 프로필 클릭 시 모달을 열고 user_id를 설정하는 함수
const openCommentProfile = (userId) => {
  commentUserId.value = userId;
  CommentModal.value = true;
  // console.log('유저ID', commentUserId.value);
};

// 게시판 프로필 모달 닫기
const closeProfileModal = () => {
  UserProfileModal.value = false;
};
// 댓글 모달 닫기
const closeCommentProfileModal = () => {
  CommentModal.value = false;
};

// 지원 모달을 닫기 위한 함수
const closeApplicant = () => {
  applicationModal.value = false;
};

// 지원완료 모달 닫기
const closeConfirmModal = () => {
  isConfirmModal.value = false;
};
</script>

<style lang="scss" scoped>
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
</style>
