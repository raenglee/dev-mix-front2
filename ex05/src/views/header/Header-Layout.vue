<template>
  <!--🔴헤더-->
  <header>
    <div class="p-3 bg-[#bc2b2b]">
      <nav class="flex space-x-5 justify-between items-center m-auto w-4/6">
        <div>
          <RouterLink to="/" class="text-4xl text-white font-bold">DEVMIX</RouterLink>
        </div>

        <!--🌐로그인 한 후 아이콘-->
        <template v-if="useStore.loginCheck">
          <div class="flex flex-wrap space-x-1">
            <div class="relative" @mouseenter="openAlarmDropdown" @mouseleave="closeAlarmDropdown">
              <!-- <font-awesome-icon
                icon="bell"
                class="h-6 w-5 cursor-pointer p-2"
                :class="{
                  'text-[#d10000] bg-white': isAlarmDropdownOpen,
                  'text-white hover:bg-[#ffffff] hover:text-[#d10000]': !isAlarmDropdownOpen
                }"
              /> -->
              <p class="px-3 py-1 whitespace-nowrap rounded-t-md font-bold cursor-pointer text-[1.3rem]"
                @mouseenter="isAlarmHovered = true" @mouseleave="isAlarmHovered = false" :class="{
                  'text-[#d10000] bg-red-50': isAlarmHovered,
                  'text-white': !isAlarmHovered
                }">
                알람
              </p>
              <!-- 알람 드롭다운 메뉴 -->
              <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <div v-if="isAlarmDropdownOpen" @mouseenter="isAlarmHovered = true" @mouseleave="isAlarmHovered = false"
                  class="absolute right-0 top-10 w-max min-w-[250px] max-w-[500px] bg-red-50 rounded-tl-md z-10 shadow-[0_4px_3px_0_rgba(0,0,0,0.1)]">
                  <template v-if="notifications?.length > 0">
                    <div class="cursor-pointer">
                      <h1 class="text-2xl p-3 bg-white">💨 알림</h1>
                      <div class="p-3 bg-slate-100">
                        <ul class="text-sm mt-2">
                          <li v-for="notification in notifications" :key="notification.id"
                            class="p-2 border border-gray-400 m-2 bg-white">
                            {{ notification.content }}
                            <!-- 알림 내용을 표시 -->
                            <button class="hover:bg-slate-300 p-2 m-2 border border-gray-300 outline-none"
                              @click="markAsRead(notification.id)">읽음 처리</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>
                </div>
              </transition>
            </div>

            <RouterLink to="/projectcreate"
              class="px-3 py-1 whitespace-nowrap rounded-md font-bold cursor-pointer text-[1.3rem]"
              :class="hovered ? 'text-[#d10000] bg-red-50' : 'text-white'" @mouseenter="hovered = true"
              @mouseleave="hovered = false">
              팀원모집하기
            </RouterLink>
            <div class="relative" @mouseenter="openPeopleDropdown" @mouseleave="closePeopleDropdown">
              <p class="px-3 py-1 whitespace-nowrap rounded-t-md font-bold cursor-pointer text-[1.3rem]"
                @mouseenter="isPeopleHovered = true" @mouseleave="isPeopleHovered = false"
                :class="{ 'text-[#d10000] bg-red-50': isPeopleHovered, 'text-white': !isPeopleHovered }">
                내정보
              </p>
              <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <div v-if="isPeopleDropdownOpen" @mouseenter="isPeopleHovered = true"
                  @mouseleave="isPeopleHovered = false"
                  class="absolute right-0 top-10 w-max min-w-[150px] max-w-[400px] bg-red-50 rounded-tl-md z-10 shadow-[0_4px_3px_0_rgba(0,0,0,0.1)]">
                  <ul class="text-sm">
                    <li>
                      <p class="px-4 py-2 font-bold text-lg">반갑습니다 {{ useStore.nickname }} 님</p>
                    </li>
                    <li>
                      <RouterLink to="/mypage/myprofile"
                        class="block px-4 py-2 text-gray-800 hover:bg-[#d1000020] hover:font-bold">
                        마이 페이지 </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/projectapplicants"
                        class="block px-4 py-2 text-gray-800 hover:bg-[#d1000020] hover:font-bold">지원자 확인</RouterLink>
                    </li>
                    <li>
                      <button @click="logout"
                        class="block w-full px-4 py-2 text-gray-800 hover:bg-[#d1000020] text-left hover:font-bold">로그아웃</button>
                    </li>
                  </ul>
                </div>
              </transition>
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
              <p class="px-3 py-1 whitespace-nowrap rounded-md font-bold cursor-pointer text-white">로그인</p>
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
import { onBeforeUnmount, onMounted, ref, watchEffect, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { loginUsers } from '@/api/loginApi';
import { useUserStore } from '@/store/userStore';
import LoginModal from '@/views/Component/LoginModal.vue';
import axios from 'axios';

const notifications = ref([]); // 알림 목록
const eventSource = ref(null); // SSE 이벤트 소스

// 읽음 처리 api 호출
const markAsRead = async (notification_id) => {
  console.log('읽음 처리할 알림 ID:', notification_id);
  try {
    await axios.patch(`http://localhost:8080/api/v1/notifications/${notification_id}/read?token=${encodeURIComponent(localStorage.getItem('token'))}`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    notifications.value = notifications.value.filter((notification) => notification.id !== notification_id);
    saveNotificationsToStorage();
  } catch (e) {
    console.log(e);
  }
};

// 로컬 스토리지에서 알림 복원
const loadNotificationsFromStorage = () => {
  const savedNotifications = localStorage.getItem('notifications');
  if (savedNotifications) {
    notifications.value = JSON.parse(savedNotifications);
  }
};

// 알림 목록을 로컬 스토리지에 저장
const saveNotificationsToStorage = () => {
  localStorage.setItem('notifications', JSON.stringify(notifications.value));
};

const token = ref(localStorage.getItem('token') || '');

// SSE 초기화
const initializeSSE = () => {

  if (eventSource.value) {
    eventSource.value.close(); // 기존 SSE 연결 종료 새로운 토큰 발급 받았을시에.
    eventSource.value = null;
  }

  if (!token.value) {
    console.error('토큰이 없습니다. SSE 연결을 중단합니다.');
    return;
  }

  const sseUrl = `http://localhost:8080/api/v1/notifications/connect?token=${encodeURIComponent(token.value)}`;
  eventSource.value = new EventSource(sseUrl);

  console.log('test');

  // SSE 연결 성공
  eventSource.value.onopen = (event) => {
    console.log('SSE 연결이 성공적으로 열렸습니다.', event);
  };

  // SSE 데이터 수신
  eventSource.value.addEventListener('connect', (event) => {
    try {
      console.log(`SSE ${event}`);
    } catch (error) {
      console.error('SSE 데이터 처리 중 오류:', error);
    }
  });

  // SSE 데이터 수신
  eventSource.value.addEventListener('sse', (event) => {
    try {

      const data = JSON.parse(event.data);

      // 데이터가 배열인 경우 처리
      if (Array.isArray(data)) {
        data.forEach(notification => {
          // 중복 알림 방지 (ID 기준)
          if (!notifications.value.some((n) => n.id === notification.id)) {
            notifications.value.push(notification);
            saveNotificationsToStorage(); // 새로운 알림 저장
          }
        });
      } else {
        // 단일 객체일 경우 처리
        const notification = data;
        if (!notifications.value.some((n) => n.id === notification.id)) {
          notifications.value.push(notification);
          saveNotificationsToStorage(); // 새로운 알림 저장
        }
      }
    } catch (error) {
      console.error('SSE 데이터 처리 중 오류:', error);
    }
  });

  // SSE 연결 오류
  eventSource.value.onerror = (error) => {
    console.error('SSE 연결 오류:', error);
    eventSource.value.close();
    eventSource.value = null;

    // 일정 시간 후 재연결 시도
    // setTimeout(() => {
    //   console.log('SSE 재연결 시도 중...');
    //   initializeSSE();
    // }, 5000); // 5초 후 재연결 시도
  };
};


// 토큰이 변경될 때마다 SSE를 재연결
watch(token, (newToken) => {
  if (newToken) {
    initializeSSE();
  }
});

// 로그인 또는 토큰 갱신 시
const onTokenUpdate = (newToken) => {
  console.log('test');
  localStorage.setItem('token', newToken);
  token.value = newToken; // 반응형 상태 갱신
};

// 최초 SSE 연결
if (token.value) {
  initializeSSE();
}

// 컴포넌트 마운트 시 처리
onMounted(() => {
  loadNotificationsFromStorage(); // 로컬 스토리지에서 알림 복원
  if (token.value) {
    initializeSSE(); // SSE 연결 초기화
  }
});

// 컴포넌트 언마운트 시 처리
onBeforeUnmount(() => {
  if (eventSource.value) {
    eventSource.value.close(); // SSE 연결 종료
    eventSource.value = null;
  }
  saveNotificationsToStorage(); // 알림 목록 저장
});

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


  if (route.query.token) {
    localStorage.setItem('token', route.query.token);

    token.value = route.query.token;

    try {
      const data = await loginUsers();
      // 닉네임이 없을 경우 /profile로 이동
      if (!data.result.nickname) {
        router.push('/profile');
      } else {
        const userData = data.result; // 예: 서버에서 반환한 사용자 정보 (username, email 등)
        const token = route.query.token; // 예: 서버에서 반환한 토큰

        // 사용자 정보와 토큰을 store에 저장
        useStore.profile(userData);

        // 토큰을 로컬스토리지에 저장 (브라우저 새로 고침 시 토큰을 유지)
        localStorage.setItem('token', token);

        router.push('/'); // 메인 페이지로 이동
      }



    } catch (error) {
      console.error('Login failed:', error);
    }
  }
});

// 드롭다운 상태 관리
const isPeopleDropdownOpen = ref(false);
const isPeopleHovered = ref(false);
const isAlarmDropdownOpen = ref(false);
const isAlarmHovered = ref(false);

const hovered = ref(false);
// const isapplyDropdownOpen = ref(false);

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
const logout = async () => {
  

  try{
    const data = await loginUsers();
    const response = axios.get(`http://localhost:8080/api/v1/notifications/${data.result.username}`);
        if (response.status === 200) {
          console.log('Disconnected successfully');
        }

  } catch(error) {
    console.error(error);
  }

  if (eventSource.value) {
    eventSource.value.close();
  }


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

//드롭다운 애니메이션
// 드롭다운 열리기 전
const beforeEnter = (el) => {
  el.style.transform = 'scaleY(0)';
  el.style.opacity = '0';
  el.style.transformOrigin = 'top';
};

// 드롭다운 열리는 동안
const enter = (el, done) => {
  el.offsetHeight;
  el.style.transition = 'transform 0.3s ease-out, opacity 0.2s ease-out';
  el.style.transform = 'scaleY(1)';
  el.style.opacity = '1';
  done();
};

// 드롭다운 닫히는 동안
const leave = (el, done) => {
  el.style.transition = 'transform 0.3s ease-in, opacity 0.2s ease-in';
  el.style.transform = 'scaleY(0)';
  el.style.opacity = '0';
  done();
};

watchEffect(() => {
  window.addEventListener('click', handleClickOutside);
  // sse();
});
</script>

<!--스타일-->
<style scoped></style>
