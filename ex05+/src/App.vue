<script setup>
import { RouterView } from 'vue-router';
import LayoutHeader from '@/views/header/Header-Layout.vue';
import Footerlayout from './views/header/Footer-Layout.vue';
// import LayoutHeadercopy from '@/views/header/RedHeader copy.vue';
import { useRouter } from 'vue-router';
import { loginUsers } from '@/api/loginApi';

const router = useRouter();  // 라우터 인스턴스 가져오기

// LayoutHeader 클릭 시 처리하는 함수
const handleHeaderClick = async () => {
  // 현재 경로가 '/profile'일 때만 유저 데이터 삭제 및 API 호출
  if (router.currentRoute.value.path === '/profile') {
    await deleteUserData();  // 유저 데이터 삭제 함수 호출
  } else {
    router.push('/');  // 다른 경로에서는 그냥 홈으로 이동
  }
};

// 유저 데이터 삭제 함수
const deleteUserData = async () => {
  try {
    // 로컬 저장소에서 유저 관련 데이터 삭제
    localStorage.removeItem('token'); // 예: 토큰 삭제

    // 서버에 유저 데이터 삭제 API 호출
    await loginUsers();

    // 데이터 삭제 후 리다이렉트 (예: 로그인 페이지로 이동)
    router.push('/');
  } catch (error) {
    console.error('유저 데이터 삭제 실패:', error);
  }
};

</script>

<template>
  <!-- <LayoutHeadercopy /> -->
  <!--로그인 안하고 로그인한상태의 헤더 보는 법-->
  <LayoutHeader @headerClick="handleHeaderClick" />
  <RouterView />
  <Footerlayout/>
  
</template>

<style scoped></style>