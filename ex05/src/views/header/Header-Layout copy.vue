<template>
  <!--🔴헤더-->
  <header>
    <div class="p-3 bg-[#d10000]">
      <nav class="flex space-x-5 justify-between items-center m-auto w-4/6">
        <div>
          <RouterLink to="/" class="text-3xl text-white font-bold">DEVMIX</RouterLink>
        </div>

        <!--🌐로그인 한 후 아이콘-->
        <template v-if="useStore.loginCheck">
          <div class="flex space-x-1">
            <div class="relative" @mouseenter="openAlarmDropdown" @mouseleave="closeAlarmDropdown">
              <font-awesome-icon
                icon="bell"
                class="h-6 w-5 cursor-pointer p-2"
                :class="{
                  'text-[#d10000] bg-white': isAlarmDropdownOpen,
                  'text-white hover:bg-[#ffffff] hover:text-[#d10000]': !isAlarmDropdownOpen
                }"
              />
              <!-- 알람 드롭다운 메뉴 -->
              <div v-if="isAlarmDropdownOpen" class="absolute right-0 top-10 w-max min-w-[150px] max-w-[400px] bg-white rounded-m z-10 shadow-[0_4px_3px_0_rgba(0,0,0,0.1)]">
                <ul class="text-sm">
                  <li>
                    <p class="px-4 py-2">지원자 신청이 도착하였습니다.</p>
                  </li>
                  <li>
                    <p class="px-4 py-2">[....]에 댓글이 작성되었습니다.</p>
                  </li>
                  <li>
                    <p class="px-4 py-2">지원자 신청이 도착하였습니다.</p>
                  </li>
                </ul>
              </div>
            </div>
            <!-- <font-awesome-icon icon="pen" class="h-6 w-5 cursor-pointer p-2 text-white hover:bg-[#ffffff] hover:text-[#d10000]" /> -->
            <!-- <nav class="flex gap-2">
              <RouterLink
                to="/projectcreate"
                class="whitespace-nowrap m-auto px-3 py-1 border border-white rounded-md shadow-lg bg-white text-[#d10000] hover:text-[#d10000] hover:font-bold transition duration-100"
              >
                글쓰기
              </RouterLink>
              <RouterLink
                to="/projectapplicants"
                class="whitespace-nowrap m-auto px-3 py-1 border border-white rounded-md shadow-lg bg-white text-[#d10000] hover:text-[#d10000] hover:font-bold transition duration-100"
                >지원자 확인</RouterLink
              >
              <RouterLink
                to="/mypage/myprofile"
                class="whitespace-nowrap m-auto px-3 py-1 border border-white rounded-md shadow-lg bg-white text-[#d10000] hover:text-[#d10000] hover:font-bold transition duration-100"
              >
                마이 페이지
              </RouterLink>
              <button
                @click="logout"
                class="whitespace-nowrap m-auto px-3 py-1 border border-white rounded-md shadow-lg bg-white text-[#d10000] hover:text-[#d10000] hover:font-bold transition duration-100"
              >
                로그아웃
              </button>
            </nav> -->

            <RouterLink to="/projectcreate" class="whitespace-nowrap m-auto px-3 py-1 text-white hover:font-bold"> 글쓰기 </RouterLink>
            <div class="relative" @mouseenter="openPeopleDropdown" @mouseleave="closePeopleDropdown">
              <!-- <font-awesome-icon
                icon="user"
                class="h-6 w-5 cursor-pointer p-2"
                :class="{
                  'text-[#d10000] bg-white': isPeopleDropdownOpen,
                  'text-white hover:bg-[#ffffff] hover:text-[#d10000]': !isPeopleDropdownOpen
                }"
              /> -->
              <div class="whitespace-nowrap m-auto px-3 py-1 text-white hover:font-bold">내정보</div>
              <div v-if="isPeopleDropdownOpen" class="absolute right-0 top-10 w-max min-w-[150px] max-w-[400px] bg-white rounded-m z-10 shadow-[0_4px_3px_0_rgba(0,0,0,0.1)]">
                <ul class="text-sm">
                  <li>
                    <p class="px-4 py-2 font-bold text-lg">반갑습니다 {{ useStore.nickname }} 님</p>
                  </li>
                  <li>
                    <RouterLink to="/mypage/myprofile" class="block px-4 py-2 text-gray-800 hover:bg-[#d1000020] hover:font-bold"> 마이 페이지 </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/projectapplicants" class="block px-4 py-2 text-gray-800 hover:bg-[#d1000020] hover:font-bold">지원자 확인</RouterLink>
                  </li>
                  <li>
                    <button @click="logout" class="block w-full px-4 py-2 text-gray-800 hover:bg-[#d1000020] text-left hover:font-bold">로그아웃</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>

        <!--⛔로그인 하기 전 아이콘-->
        <template v-else>
          <div class="flex space-x-5">
            <button class="focus:outline-none" @click.stop="modalLogin('login')">
              <!-- <img src="/img/person.png" class="h-6 w-5" /> -->
              <!-- <font-awesome-icon icon="user" class="h-6 w-5 cursor-pointer text-white" /> -->
              <!-- <font-awesome-icon icon="user" class="h-6 w-5 cursor-pointer p-2 text-white hover:bg-[#ffffff] hover:text-[#d10000]" /> -->
              <p class="px-3 py-1 border border-white rounded-md shadow-lg bg-white text-[#d10000] hover:text-[#d10000] hover:font-bold transition duration-100">로그인</p>
            </button>
          </div>
        </template>
      </nav>
    </div>
  </header>

  <!-- LoginModal 컴포넌트 -->
  <LoginModal :isModal="isModal" @update:isModal="closeModal" />
</template>

<!--스크립트-->
<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { loginUsers } from '@/api/loginApi';
import { useUserStore } from '@/store/userStore';
import LoginModal from '@/views/Component/LoginModal.vue';

//모달
const isModal = ref(false);

const modalLogin = async () => {
  isModal.value = !isModal.value;
};

// 모달 닫기 (배경 클릭 시)
const closeModal = () => {
  isModal.value = false;
};

//로그인
const route = useRoute();
const router = useRouter();
const useStore = useUserStore();

watchEffect(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    try {
      // 토큰 저장
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage:', token);

      // URL에서 토큰 제거
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);

      // 사용자 정보 요청
      const data = await loginUsers();

      if (!data.result.nickname) {
        router.push('/profile'); // 닉네임 없으면 프로필 설정 페이지로 이동
      } else {
        const userData = data.result;

        // 사용자 정보 저장
        useStore.profile(userData);

        // 메인 페이지로 이동
        router.push('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  } else {
    console.error('No token found in URL');
  }
});

// 드롭다운 상태 관리
const isPeopleDropdownOpen = ref(false);
const isAlarmDropdownOpen = ref(false);
const isapplyDropdownOpen = ref(false);

// 마이페이지 드롭다운 열기
const openPeopleDropdown = () => {
  isPeopleDropdownOpen.value = true;
};

// 마이페이지 드롭다운 닫기
const closePeopleDropdown = () => {
  isPeopleDropdownOpen.value = false;
};

// 알람 드롭다운 열기
const openAlarmDropdown = () => {
  isAlarmDropdownOpen.value = true;
};

// 알람 드롭다운 닫기
const closeAlarmDropdown = () => {
  isAlarmDropdownOpen.value = false;
};

// 로그아웃 함수
const logout = () => {
  localStorage.removeItem('token');
  useStore.logout();
  alert('로그아웃 성공');
  router.push('/');
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isPeopleDropdownOpen.value = false;
  }
};

watchEffect(() => {
  window.addEventListener('click', handleClickOutside);
});
</script>

<!--스타일-->
<style scoped></style>
