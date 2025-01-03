<template>
  <div class="m-auto w-full flex justify-center">
    <div class="my-3 w-full" style="width: 900px">
      <!-- <div class="justify-center items-center"> -->
      <form @submit.prevent="handleSubmit" class="grid gap-y-6 px-20 py-10">
        <!-- 프로필 사진 -->
        <div class="grid grid-cols-4 items-center gap-x-4">
          <label class="text-gray-700 text-lg font-semibold">프로필 사진</label>
          <div class="col-span-2 flex items-center">
            <input type="file" @change="onFileChange" accept="image/*" class="hidden" ref="fileInput" placeholder="useStore.proFile.profileImage" />
            <div class="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer relative" @click="selectFile">
              <!-- 프로필 이미지가 있을 경우 -->
              <img v-if="profileImage" :src="profileImage" class="w-full h-full rounded-full object-cover" id="profileImg" />
              <!-- 프로필 이미지가 없을 경우 피플 이미지와 이미지 체인지 아이콘 겹치게-->
              <div v-else class="relative w-full h-full">
                <img src="/img/people.png" class="w-full h-full rounded-full object-cover" />
                <img src="/img/changeProfile.png" class="absolute opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6" />
              </div>
            </div>
            <!-- 삭제 아이콘 -->
            <img :src="imageSrc" @click.stop="removeFile" @mouseover="hoverImage" @mouseleave="resetImage" class="w-[20px] h-[20px] text-gray-500 text-lg" />
          </div>
        </div>

        <!--이메일-->
        <div class="grid grid-cols-4 items-center gap-x-4">
          <label class="text-gray-700 text-lg font-semibold">이메일 </label>
          <div class="col-span-2 flex items-center">
            <p class="flex-1p-2 rounded-full">{{ useStore.email }}</p>
            <!-- <button type="button" @click="checkNickname"
                class="ml-2 border p-2 rounded-full text-gray-600">중복확인</button> -->
          </div>
        </div>
        <!-- 닉네임 -->
        <div class="grid grid-cols-4 items-center gap-x-4">
          <label class="text-gray-700 text-lg font-semibold">닉네임 <span class="text-red-500">*</span></label>
          <div class="col-span-2 items-center">
            <input type="text" v-model="nickname" placeholder="nickname" class="flex-1 border p-2 rounded-full" required />
            <button type="button" @click="checkNicknameAvailability" class="ml-2 border p-2 rounded-full text-gray-600">중복확인</button>
            <p class="col-start-2 col-span-2 text-xs mt-1 text-gray-500">한글 영어 숫자, 2~8글자 이하 (공백 및 특수문자 X)</p>
            <p class="text-red-500 col-start-2 col-span-2 text-xs mt-1">
              {{ checkNickMessage }}
            </p>
          </div>
        </div>
        <!-- 소속 -->
        <div class="grid grid-cols-4 items-center gap-x-4">
          <label class="text-gray-700 text-lg font-semibold">소속</label>
          <input type="text" v-model="groupName" placeholder="" class="col-span-2 border p-2 h-10 rounded-full w-full" />
        </div>

        <!--🌍지역 / 구분 드롭다운-->
        <div class="grid grid-cols-4 items-center gap-x-4">
          <h1 class="font-bold text-lg pb-2">지역</h1>
          <div class="min-w-[450px]">
            <div class="col-start-2">
              <select v-model="location" class="w-52 h-10 p-2 border border-gray-200 rounded-full cursor-pointer focus:outline-none">
                <option value="" disabled>{{ location ? location : '지역을 선택하세요' }}</option>
                <option>미정</option>
                <option>서울</option>
                <option>경기</option>
                <option>인천</option>
                <option>강원</option>
                <option>대구/경북</option>
                <option>대전/충청</option>
                <option>부산/울산/경남</option>
                <option>광주/전라</option>
                <option>제주</option>
              </select>
            </div>
          </div>
        </div>
        <!-- 포지션 새로운거-->
        <div class="grid grid-cols-5 items-center gap-x-4" ref="dropdownContainer">
          <h1 class="col-start-1 font-bold text-left text-lg pb-2">포지션</h1>
          <div class="relative pl-10 w-full m-auto flex">
            <div class="border border-gray-200 rounded-lg min-w-[450px]">
              <div class="p-3">
                <template v-if="userProfile">
                  <div v-for="positionName in roleOptions" :key="positionName" class="flex wrap gap-2">
                    <input
                      :checked="userProfile.positions.some((pos) => pos.positionName === positionName.positionName)"
                      type="checkbox"
                      :value="positionName.positionName"
                      :id="positionName.positionName"
                      @change="handlePositionChange(positionName.positionName)"
                      class="cursor-pointer form-checkbox h-5 w-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500"
                    />

                    <label class="cursor-pointer" :for="positionName.positionName">{{ positionName.positionName }}</label>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!--✅기술/언어 선택 -> 다중선택, 선택삭제 가능하도록-->
        <div class="grid grid-cols-5 gap-x-4" ref="dropdownContainer">
          <h1 class="col-start-1 font-bold text-lg pb-2">기술 / 언어<br /><span class="text-sm mx-1">(최대 10개)</span></h1>
          <div class="relative w-full m-auto pl-7 flex">
            <div @click="toggleDropdown" class="min-w-72 h-10 p-2 border border-gray-200 rounded-full cursor-pointer flex items-center justify-between">
              <span>{{ selectedSkill.value || '기술을 선택하세요' }}</span>
              <font-awesome-icon icon="chevron-down" class="text-gray-300 pl-2" />
            </div>
            <!--드롭다운-->
            <div v-if="isDropdownOpen" class="absolute bg-white border border-gray-200 rounded-lg mt-12 ml-1 min-w-96 z-10">
              <div class="grid grid-cols-5 gap-2 p-2">
                <div v-for="tech in getAvailableTechOptions()" :key="tech.techStackName.result" @click="selectSkill(tech)" class="cursor-pointer text-sm gap-3">
                  <img :src="tech.imageUrl" class="w-10 h-12 item-center hover:w-12" />
                  <p class="">{{ tech.techStackName }}</p>
                </div>
              </div>
            </div>

            <div class="min-w-[400px] flex flex-wrap">
              <div v-for="(skill, index) in selectedSkills" :key="index" @click="removeSkill(index)" class="pl-4 mt-1 mb-3 flex items-center gap-2 cursor-pointer">
                <img :src="skill.imageUrl" class="w-8 h-8" />
                <span class="text-sm m-auto w-16"> {{ skill.techStackName }}</span>
                <span class="text-[#d10000] font-bold mx-3">x</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="flex justify-center gap-4 mt-20 mb-40">
          <button type="button" @click="handleCancel" class="px-6 py-2 border border-gray-300 rounded-md">취소</button>
          <button type="submit" class="px-6 py-2 bg-red-600 text-white rounded-md">완료</button>
        </div>
      </form>
    </div>
  </div>

  <!-- </div> -->
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount, watch } from 'vue';
import { useUserStore } from '@/store/userStore';
import { loginUsers, uploadprofile, checkNickname } from '@/api/loginApi';
import { useRouter } from 'vue-router';
import { getPositions, getTechstacks } from '@/api/projectApi';

const useStore = useUserStore();
const router = useRouter();

const checkNickMessage = ref(''); // 닉네임 유효성 메시지
const isDuplicate = ref(false); //닉넴중복
const isValidNickname = ref(false); //형식틀림
const isDuplicateChecked = ref(false); // 중복확인 여부

const nickname = ref(useStore.nickname);
const groupName = ref(useStore.groupName);
const positionList = ref([]);
const location = ref(useStore.location);
const profileImage = ref(useStore.profileImage); //기존 파일
const fileInput = ref(null);
const selectedFile = ref(null); // 실제 파일 객체 (FormData에 첨부할 용도)

const selectedSkill = ref(''); // 현재 선택된 기술 저장
const selectedSkills = ref([]); // 선택된 기술들의 배열
const techOptions = ref([]); // 서버에서 전달 받은 기술 저장

const checkNicknameAvailability = async () => {
  const res = await checkNickname(nickname.value); // API 호출
  try {
    if (res.code === 'SUCCESS' ||nickname.value == useStore.nickname){
      isDuplicate.value = false; //중복닉
      isValidNickname.value = false; // 형식오류
      isDuplicateChecked.value = true;
      nickname.value == useStore.nickname
      alert('사용 가능한 닉네임입니다.');
    } else if (res.code === 'DUPLICATED_NICKNAME') {
      isDuplicate.value = true; //중복닉
      isValidNickname.value = false; // 형식오류
      isDuplicateChecked.value = true;
      alert('중복된 닉네임입니다.');
    } else if (res.code === 'VALIDATION_FAILED') {
      isDuplicate.value = false; //중복닉
      isValidNickname.value = true; // 형식오류
      isDuplicateChecked.value = true;
      alert('닉네임 형식 오류입니다.');
    } else {
      alert('에러입니다 서버관리자에게 문의 하세요');
    }
  } catch (err) {
    console.error('닉네임 확인 중 오류 발생:', err);
    isDuplicateChecked.value = false;
  }
};

watch(nickname, (newVal) => {
  const nicknameValue = newVal.trim();
  if (nicknameValue === '') {
    checkNickMessage.value = '닉네임을 입력해주세요.';
  } else if (nicknameValue.length < 2 || nicknameValue.length > 8) {
    checkNickMessage.value = '닉네임은 2~8글자여야 합니다.';
  } else if (!/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(nicknameValue)) {
    checkNickMessage.value = '공백 및 특수문자는 사용할 수 없습니다.';
  } else {
    checkNickMessage.value = '';
  }
});

//🚹 분야별 모집 인원 관련 scripts
const roleOptions = ref([]); // 서버에서 전달 받은 포지션 저장
const userProfile = ref(null);

const isDropdownOpen = ref(false); // 드롭다운 닫힌 상태
const availableTechOptions = ref([]);

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
      positionList.value.push(temp.positionName);
    });

    selectedSkills.value = updatedTechStacks;

    const excludedTechStacks = [];
    profile.result.techStacks.map((techStacks) => {
      excludedTechStacks.push(techStacks.techStackName);
    });

    const filteredTechStacks = availableTechOptions.value.filter((stack) => !excludedTechStacks.includes(stack.techStackName));
    availableTechOptions.value = filteredTechStacks;
  } catch (error) {
    console.error('프로필 정보를 불러오는 데 실패했습니다.', error);
  }
};

// 프로필 이미지를 선택하는 핸들러
const onFileChange = (event) => {
  const file = event.target.files[0]; // 사용자가 선택한 첫 번째 파일을 가져옵니다.
  if (file) {
    selectedFile.value = file; // 파일을 저장 (FormData에 첨부할 파일)
    profileImage.value = URL.createObjectURL(file); // 이미지 미리보기 URL을 설정
  }
};

// 이미지 소스를 ref로 관리
const imageSrc = ref('/img/trash.png');

// 호버 시 이미지 변경
const hoverImage = () => {
  imageSrc.value = '/img/redTrash.png';
};

// 마우스가 떠날 때 이미지 복원
const resetImage = () => {
  imageSrc.value = '/img/trash.png';
};

// 파일 삭제
const removeFile = () => {
  profileImage.value = null;
};

// 파일 인풋을 열기 위한 메서드
const selectFile = () => {
  const fileInput = document.querySelector('input[type="file"]');
  fileInput.click(); // 파일 인풋을 클릭하여 파일 선택
};

// 프로필 이미지가 서버에 저장되어 있다면 이를 처리하기 위한 로직
watchEffect(() => {
  if (useStore.profileImage) {
    // 서버에서 받은 이미지 URL을 `profileImage`에 설정
    profileImage.value = useStore.profileImage;
  }
});

// 사용자가 입력한 데이터 저장
const handleSubmit = async () => {
  const formData = new FormData();
  const user = await loginUsers(); // 로그인된 사용자 정보 가져오기

  positionList.value = Array.from(new Set(positionList.value));
  const techStackNames = selectedSkills.value.reduce((acc, skill) => {
    acc.push(skill.techStackName);
    return acc;
  }, []);

  const userProfile = {
    email: user.result.email,
    nickname: nickname.value,
    groupName: groupName.value,
    location: location.value,
    positionList: positionList.value,
    techStackList: techStackNames,
    profileImage: profileImage.value
  };

  if (profileImage.value) {
    const file = selectedFile.value; // 실제 파일 객체 사용
    if (file != null)
      formData.append('profileImage', file, file.name); // 여기서 file.name으로 파일명 설정
    else {
      const imgSrc = document.getElementById('profileImg').src;

      await fetch(imgSrc)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], 'profileImage.png', { type: blob.type });
          formData.append('profileImage', file, 'aaa.png');
        })
        .catch((error) => console.error('Error fetching image:', error));
    }
  }

  formData.append('userProfile', new Blob([JSON.stringify(userProfile)], { type: 'application/json; charset=UTF-8' }));
  // console.log('폼데이터최종', JSON.stringify(userProfile));

  try {
    const res = await checkNickname(nickname.value); // API 호출
    if (res.code === 'DUPLICATED_NICKNAME') {
      alert('닉네임 중복 확인 하세요');
      isDuplicateChecked.value = false;
      return;
    }else{
      isDuplicateChecked.value = true;

    }
    if (nickname.value !== useStore.nickname && res.code === 'VALIDATION_FAILED') {
      alert('닉네임 형식을 확인 하세요');
      isDuplicateChecked.value = false;
      return;
    } else {
      isDuplicateChecked.value = true;
    }
    await uploadprofile(formData); // formData 대신 userProfile 객체를 전달
    const data = await loginUsers();
    await useStore.profile(data.result); // 사용자 정보를 Pinia 스토어에 저장
    if (isDuplicateChecked.value || nickname.value == useStore.nickname) {
      alert('수정 되었습니다.');
      await router.push('/mypage/myprofile'); // 성공 시 프로필 페이지로 이동
    }
  } catch (err) {
    // 에러 처리
    alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
  }
};

const handleCancel = async () => {
  
  router.push('/mypage/myprofile');
};


// 기술 / 언어 서버 연결
const updateTechstacks = async () => {
  try {
    const res = await getTechstacks();
    // console.log('updateTechstacks 데이터 확인: ', res);
    techOptions.value = res.result; // 받아온 기술 목록을 techOptions에 저장
    if (Array.isArray(res.data.result)) {
      techOptions.value = res.data.result.map((item) => ({
        // 받아오는 정보가 두개이상이므로 map으로 가져온다.
        techStackName: item.techStackName,
        imageUrl: item.imageUrl
      }));
    } else {
      console.error('기술/언어 배열 저장 에러', res);
    }
  } catch (error) {
    console.error('실패:', error);
  }
};

// 선택된 기술을 제외한 선택 가능한 기술목록을 반환하는 메서드
const getAvailableTechOptions = () => {
  return techOptions.value.filter((tech) => !selectedSkills.value.map((skill) => skill.techStackName).includes(tech.techStackName));
};

// 기술 선택
const selectSkill = (tech) => {
  if (!selectedSkills.value.includes(tech) && selectedSkills.value.length < 10) {
    if (!selectedSkills.value.includes(tech)) {
      selectedSkills.value.push(tech);
      const indexToRemove = availableTechOptions.value.indexOf(tech); // "b"의 인덱스를 찾음
      if (indexToRemove !== -1) {
        availableTechOptions.value.splice(indexToRemove, 1); // 인덱스 위치에서 1개 요소 삭제
      }
    }
  }

  if (getAvailableTechOptions.value.length === 0) {
    isDropdownOpen.value = false;
  }
  // console.log(selectedSkills.value);
};

const removeSkill = (index) => {
  const removedSkill = selectedSkills.value[index]; // 삭제할 기술을 가져옵니다.
  selectedSkills.value.splice(index, 1); // 선택된 기술에서 해당 기술 삭제

  // 기술을 availableTechOptions에 다시 추가
  availableTechOptions.value.push(removedSkill);
};

const handlePositionChange = (positionName) => {
  // 체크된 경우
  if (positionList.value.includes(positionName)) {
    // 체크 해제된 경우, positionList에서 해당 포지션을 제거
    positionList.value = positionList.value.filter((pos) => pos !== positionName);
  } else {
    // 체크된 경우, positionList에 해당 포지션을 추가
    positionList.value.push(positionName);
  }

  // 배열의 중복을 방지하기 위해 Set을 사용하여 중복된 항목을 제거
  positionList.value = Array.from(new Set(positionList.value));
};

// 포지션 서버 연결
const updatePositions = async () => {
  try {
    const res = await getPositions();
    // console.log('updatePsotions 데이터 확인: ', res);
    if (Array.isArray(res.data.result)) {
      roleOptions.value = res.data.result; // 목록이 이름 하나이므로 배열에 넣을 필요X
    } else {
      console.error('분야별 모집 인원 배열 저장 에러', res);
    }
  } catch (error) {
    console.error('실패:', error);
  }
};

// 드롭다운 열고 닫기
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 바탕 클릭 이벤트 처리
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && isDropdownOpen.value) {
    // 드롭다운 내부가 아닌 경우 닫기
    isDropdownOpen.value = false;
  }
};

watchEffect(() => {
  updateTechstacks(); // 기술, 언어 API 호출
  updatePositions(); // 포지션 API 호출

  loadUserProfile();

  document.addEventListener('mousedown', handleClickOutside);
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
