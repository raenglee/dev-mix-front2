<template>
  <div class="w-3/6 mx-auto">
    <div class="flex pt-10">
      <font-awesome-icon icon="pen" class="h-6 w-5 p-1 mr-1 text-gray-300" />
      <h1 class="font-bold text-2xl text-gray-800">프로젝트 생성</h1>
    </div>

    <div class="my-3 mb-6">
      <hr class="border-t-4 border-[#d10000]" />
      <p class="text-xs my-2 font-bold text-gray-500"><span class="text-[#d10000] mx-1">*</span>프로젝트는 빈 항목이 없이 작성되어야 합니다.</p>
    </div>

    <!--📝프로젝트 생성 선택 구간-->
    <div class="flex flex-col">
      <h1 class="font-bold text-lg mb-2 text-gray-800">프로젝트 명<span class="text-[#d10000] mx-1">*</span></h1>
      <input type="text" v-model="title" class="min-w-full h-10 border border-gray-200 justify-center items-center rounded-full p-3 focus:outline-none" placeholder="프로젝트 명을 입력하세요." />

      <!--지역/구분, 진행 기간, 모집 마감일-->
      <div class="flex justify-between gap-5 mt-5 flex-wrap">
        <!--🌍지역 / 구분 드롭다운-->

        <div class="flex flex-col w-60">
          <h1 class="font-bold text-lg pb-2 text-gray-800">지역 / 구분<span class="text-[#d10000] mx-1">*</span></h1>
          <div class="relative">
            <!-- Select Input -->
            <select
              v-model="location"
              class="w-full h-12 px-4 pr-10 border border-gray-300 rounded-full bg-white text-gray-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 appearance-none transition"
            >
              <option disabled value="">지역 / 구분을 선택하세요</option>
              <option v-for="location in locationOptions" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
            <!-- Custom Arrow -->
            <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <!--진행 기간 드롭다운-->
        <div class="flex flex-col w-60">
          <h1 class="font-bold text-lg pb-2 text-gray-800">진행 기간<span class="text-[#d10000] mx-1">*</span></h1>
          <div class="relative">
            <!-- Select Input -->
            <select
              v-model="project_period"
              class="w-full h-12 px-4 pr-10 border border-gray-300 rounded-full bg-white text-gray-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 appearance-none transition"
            >
              <option value="" disabled>
                {{ project_period ? project_period : '진행 기간을 선택하세요' }}
              </option>
              <option>미정</option>
              <option>1개월 미만</option>
              <option>1개월</option>
              <option>2개월</option>
              <option>3개월</option>
              <option>4개월</option>
              <option>5개월</option>
              <option>6개월 이상</option>
            </select>
            <!-- Custom Arrow -->
            <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <!-- 모집 마감일 -->
        <div class="flex flex-col">
          <h1 class="font-bold text-lg pb-2 text-gray-800">
            모집 마감일
            <span class="text-[#d10000] mx-1">*</span>
          </h1>
          <div class="relative">
            <!-- 날짜 입력 필드 -->
            <input
              v-model="recruit_end_date"
              type="date"
              :min="minDate"
              required
              class="w-52 h-12 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 transition bg-white text-gray-700"
            />
            <!-- 커스텀 캘린더 아이콘 -->
            <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-between mt-5" ref="dropdownContainer">
        <h1 class="font-bold text-lg pb-2 text-gray-800">
          기술 / 언어<span class="text-sm mx-1">(최대 10개)</span>
          <span class="text-[#d10000] mx-1">*</span>
        </h1>
        <div class="w-full">
          <div class="relative flex flex-row">
            <!-- 드롭다운 트리거 -->
            <div @click="toggleDropdown" class="h-12 px-4 border border-gray-300 rounded-full bg-white shadow-sm cursor-pointer flex items-center justify-between transition">
              <span class="text-gray-700">
                {{ selectedSkill.value || '기술을 선택하세요' }}
              </span>
              <font-awesome-icon icon="chevron-down" class="text-gray-400 pl-2" />
            </div>

            <!-- 드롭다운 메뉴 -->
            <div v-if="isDropdownOpen" class="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 top-10 w-96 z-10">
              <div class="grid grid-cols-5 gap-4 p-4">
                <div
                  v-for="tech in availableTechOptions"
                  :key="tech"
                  @click="selectSkill(tech)"
                  class="cursor-pointer text-sm flex flex-col items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <img :src="tech.imageUrl" class="w-12 h-12 object-cover hover:scale-110 transition" />
                  <p class="text-center text-gray-700">{{ tech.techStackName }}</p>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap ml-4 gap-2 flex-1">
              <div
                v-for="(skill, index) in selectedSkills"
                :key="index"
                @click="removeSkill(index)"
                class="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full cursor-pointer hover:bg-red-50 transition"
              >
                <img :src="skill.imageUrl" class="w-8 h-8 object-cover" />
                <span class="text-sm text-gray-700">{{ skill.techStackName }}</span>
                <p class="text-[#d10000] font-bold">x</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 선택된 기술들 -->
      <!--🚹분야별 모집 인원 -> 추가, 삭제 가능하도록-->
      <div class="flex flex-col mt-5">
        <h1 class="font-bold text-lg pb-2 text-gray-800">
          분야별 모집 인원
          <span class="text-[#d10000] mx-1">*</span>
          <span class="text-gray-500 text-xs text-center">중복 불가, 분야별 최대 5인 까지</span>
        </h1>

        <div>
          <div v-for="(position, index) in positions" :key="index" class="flex items-center space-x-4 mb-4">
            <!-- 포지션 선택 부분 -->
            <div class="relative">
              <select
                v-model="position.positionName"
                class="w-64 h-12 px-4 border border-gray-300 rounded-full appearance-none bg-white shadow-sm focus:outline-none focus:ring-2 transition"
              >
                <option disabled value="">분야를 선택하세요</option>
                <option v-for="positionName in roleOptions" :key="positionName.positionName" :value="positionName.positionName">
                  {{ positionName.positionName }}
                </option>
              </select>
              <!-- 커스텀 화살표 -->
              <span class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
              </span>
            </div>

            <!-- 사람 수 조절 버튼 -->
            <div class="flex items-center gap-2">
              <button type="button" @click="decreaseCount(index)" class="w-8 h-8 rounded-full border border-gray-300 text-gray-400 hover:bg-gray-300 hover:text-white transition">
                <FontAwesomeIcon icon="fa-solid fa-minus" />
              </button>
              <span class="w-5 text-center text-[1.2rem]">{{ position.requiredCount }}</span>
              <button type="button" @click="increaseCount(index)" class="w-8 h-8 rounded-full border border-gray-300 text-gray-400 hover:bg-[#d10000] hover:text-white transition">
                <FontAwesomeIcon icon="fa-solid fa-plus" />
              </button>
            </div>

            <!-- 추가/삭제 버튼 -->
            <div class="flex gap-2">
              <!-- 삭제 버튼 -->
              <button
                type="button"
                @click="removePosition(index)"
                v-if="index > 0"
                class="text-[#d10000] text-sm px-4 py-2 border font-bold border-gray-300 rounded-full hover:bg-[#d10000] hover:text-white hover:border-[#d10000] transition"
              >
                삭제
              </button>
              <!-- 추가 버튼 -->
              <button
                v-if="index === positions.length - 1"
                type="button"
                @click="addPosition"
                class="text-[#7371fc] text-sm px-4 py-2 border font-bold border-gray-300 rounded-full hover:bg-[#7371fc] hover:text-white hover:border-[#7371fc] transition"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--구분선-->
      <div class="my-3 mb-5 mt-10">
        <hr class="border-t-4 border-[#d10000]" />
      </div>

      <!--프로젝트 상세 소개-->
      <div>
        <h1 class="font-bold text-lg mb-3 text-gray-800">프로젝트 소개<span class="text-[#d10000] mx-1">*</span></h1>
        <textarea
          v-model="content"
          class="w-full p-3 mb-2 h-96 border border-gray-200 rounded-md focus:outline-none ring-gray-300 resize-none text-gray-700 placeholder-gray-400 bg-white"
          required
        ></textarea>
      </div>

      <!-- 파일 첨부 -->
      <div>
        <!-- 드래그 앤 드롭 영역 -->
        <div class="dropbox p-10 bg-gray-100 rounded-md cursor-pointer" @dragover.prevent @drop.prevent="dropFile" @click="triggerFileInput">
          <p v-if="!file" class="text-center text-gray-500 cursor-pointer">
            <FontAwesomeIcon icon="fa-solid fa-image" size="2xl" />
            사진을 드래그하거나 클릭하여 첨부하세요.
          </p>
          <div v-else>
            <!-- 텍스트와 아이콘을 중앙 정렬하고 옆에 아이콘을 배치 -->
            <div class="flex items-center justify-center space-x-1 mb-2">
              <!-- file.name을 중앙 정렬하고, 아이콘은 그 옆에 붙여 배치 -->
              <p class="text-center text-gray-500 cursor-pointer flex-shrink-0">{{ file.name }}</p>
              <!-- 삭제 아이콘 -->
              <button @click.stop="removeFile" class="text-gray-500 text-lg hover:text-[#d10000]">
                <FontAwesomeIcon icon="fa-solid fa-trash" size="sm" />
              </button>
            </div>
            <!-- 이미지 미리보기 -->
            <img v-if="file && file.type.startsWith('image')" :src="filePreviewUrl" class="w-32 h-32 object-cover mx-auto" />
          </div>
        </div>

        <!-- input type file 숨기기 -->
        <input ref="fileInput" type="file" @change="onFileChange" style="display: none" />
      </div>

      <!-- 취소, 등록 버튼 -->
      <div class="flex justify-center space-x-4 pt-4 mt-5 mb-5">
        <button type="button" class="text-m text-gray-800 px-3 py-1 border border-gray-200 rounded-full hover:bg-gray-300 hover:text-black hover:border-gray-300" @click="cancel">취소</button>
        <button type="submit" class="text-m text-gray-800 px-3 py-1 border border-gray-200 rounded-full hover:bg-[#d10000] hover:text-white hover:border-[#d10000]" @click="save">등록</button>
      </div>
    </div>
    <!--프로젝트 생성 선택 구간 끝-->
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, watchEffect } from 'vue';
import { FontAwesomeIcon } from '@/assets/FontAwesome';
import { getPositions, saveProject, getTechstacks, getLocation } from '@/api/projectApi';
import { useRouter } from 'vue-router';

const router = useRouter();
const isDropdownOpen = ref(false); // 드롭다운 닫힌(false) 상태

// 🌍지역 / 구분 선택 관련 scripts
const locationOptions = ref([]); // 서버에서 전달 받은 지역 저장

const updateLocations = async () => {
  try {
    const res = await getLocation();
    // console.log('updateLocations 데이터 확인: ', res.data);
    if (Array.isArray(res.data.result)) {
      locationOptions.value = res.data.result; // 목록이 이름 하나이므로 배열에 넣을 필요X
    } else {
      console.error('지역 / 구분 배열 저장 에러', res);
    }
  } catch (error) {
    console.error('실패:', error);
  }
};

// ✅ 기술 / 언어 선택 관련 scripts

const selectedSkill = ref(''); // 현재 선택된 기술 저장
const selectedSkills = ref([]); // 선택된 기술들의 배열
const techOptions = ref([]); // 서버에서 전달 받은 기술 저장

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

// 선택된 기술을 제외한 선택 가능한 기술목록
const availableTechOptions = computed(() => {
  return techOptions.value.filter((tech) => !selectedSkills.value.includes(tech));
});

// 드롭다운 열고 닫기
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 기술 선택
const selectSkill = (tech) => {
  if (!selectedSkills.value.includes(tech) && selectedSkills.value.length < 10) {
    selectedSkills.value.push(tech);
  }

  // 선택 후 남은 기술이 없으면 드롭다운 닫기
  if (availableTechOptions.value.length === 0) {
    isDropdownOpen.value = false;
  }
};

// 기술 삭제
const removeSkill = (index) => {
  selectedSkills.value.splice(index, 1);
};

// 바탕 클릭 이벤트 처리
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

//🚹 분야별 모집 인원 관련 scripts

const positions = ref([{ positionName: '', requiredCount: 1 }]);
const roleOptions = ref([]); // 서버에서 전달 받은 포지션 저장

// 포지션 서버 연결
const updatePositions = async () => {
  try {
    const res = await getPositions();
    // console.log('updatePsotions 데이터 확인: ', res.data.result);
    if (Array.isArray(res.data.result)) {
      roleOptions.value = res.data.result; // 목록이 이름 하나이므로 배열에 넣을 필요X
    } else {
      console.error('분야별 모집 인원 배열 저장 에러', res);
    }
  } catch (error) {
    console.error('실패:', error);
  }
};

// 포지션 추가
const addPosition = () => {
  positions.value.push({
    positionName: '', // 초기값 빈 값으로 해서 '분야를 선택하세요'가 표시되도록 함
    requiredCount: 1 // 초기 사람 수는 1로 설정
  });
};

// 포지션 삭제
const removePosition = (index) => {
  positions.value.splice(index, 1);
};

// 사람 수 증가
const increaseCount = (index) => {
  // 최소값 1, 최대값 5 제한
  if (positions.value[index].requiredCount < 5) {
    positions.value[index].requiredCount += 1;
  }
};

// 사람 수 감소
const decreaseCount = (index) => {
  if (positions.value[index].requiredCount > 1) {
    positions.value[index].requiredCount -= 1;
  }
};

// 파일 첨부 및 저장
const file = ref(null); // 선택된 파일
const selectedFile = ref(null); // 드래그 앤 드롭에서 선택된 파일의 이름
const fileInput = ref(null); // 파일 입력을 위한 ref

// 파일 미리보기 URL 생성
const filePreviewUrl = computed(() => {
  // file이 존재할 경우 미리보기 URL을 생성
  return file.value ? URL.createObjectURL(file.value) : '';
});

// 파일 선택 후 처리
const onFileChange = (event) => {
  const selected = event.target.files[0];
  if (selected) {
    file.value = selected;
    selectedFile.value = selected.name; // 파일 이름을 저장
  }
};

// 파일 드래그 앤 드롭 시 처리
const dropFile = (event) => {
  event.preventDefault();
  const droppedFiles = event.dataTransfer.files;
  if (droppedFiles.length > 0) {
    file.value = droppedFiles[0]; // 첫 번째 파일을 선택
    selectedFile.value = file.value.name; // 파일 이름을 저장
  }
};

// 파일 input 클릭 트리거
const triggerFileInput = () => {
  fileInput.value.click();
};

const removeFile = () => {
  file.value = null;
  // 파일 입력 필드 초기화
  fileInput.value.value = null; // 입력 필드의 값도 초기화
};

// 게시글 등록
const title = ref('');
const content = ref('');
const location = ref('');
const project_period = ref('');
const recruit_end_date = ref('');


const formatContent = (content) => {
  // 여러 줄바꿈을 처리하고, 공백은 그대로 두기
  const formattedContent = content
    .split('\n')  // 줄바꿈을 기준으로 나누기
    .map(paragraph => {
      // 연속된 공백을 &nbsp;로 변환
      return paragraph.replace(/ /g, '&nbsp;');  // 공백을 &nbsp;로 바꿈
    })
    .map(paragraph => {
      // 빈 줄을 유지하도록 처리
      if (paragraph === '') {
        return '<p>&nbsp;</p>'; // 빈 줄은 &nbsp;로 대체하여 표시
      }
      return `<p>${paragraph}</p>`; // 각 문단을 <p>로 감쌈
    })
    .join(''); // 문단들을 합침
  return formattedContent;
};

const save = async () => {

  const formattedContent = formatContent(content.value); // content에 대한 변환

  const data = {
    title: title.value,
    content: formattedContent,
    projectPeriod: project_period.value,
    location: location.value,
    startDate: start_date.value,
    recruitEndDate: recruit_end_date.value,
    boardTechStackList: selectedSkills.value,
    boardPositionList: positions.value
  };

  const formData = new FormData();
  formData.append('postBoardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  formData.append('boardImage', file.value);

  // console.log('파일정보', file.value);

  // const formData = new FormData();
  // formData.append('postBoardRequest', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  // console.log('저장내용', data);
  const res = await saveProject(formData);
  // console.log(JSON.stringify(formData));
  if (res.status === 200) {
    alert('글이 작성되었습니다.');
    router.push({ name: 'projectmanagement' });
    return;
  }
  alert('빈 항목이 없어야 합니다');
};

// 게시글 등록 취소
const cancel = () => {
  const isConfirmed = window.confirm('현재 작성 중인 내용은 저장되지 않습니다. 작성을 취소하시겠습니까?');
  if (isConfirmed) {
    // console.log('게시글 작성 취소버튼 눌리는지 확인');
    router.push({ name: 'projectmanagement' });
  } else {
    // 취소한 경우 아무런 동작도 하지 않으므로 아무것도 적지 않기
    // console.log('게시글 작성 취소를 취소');
  }
};

// 날짜 오늘 날짜 전 선택 불가능하도록
const start_date = ref('');

const minDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
  const day = String(today.getDate()).padStart(2, '0');
  start_date.value = `${year}-${month}-${day}`;
  return `${year}-${month}-${day}`; // 현재 날짜를 YYYY-MM-DD 형식으로 반환
});

// 이벤트 리스너
watchEffect(() => {
  updateTechstacks(); // 기술, 언어 API 호출
  updatePositions(); // 포지션 API 호출
  updateLocations(); // 지역 API 호출
  document.addEventListener('mousedown', handleClickOutside); // 바탕 클릭 시 드롭다운 닫기
});
</script>

<style lang="scss" scoped></style>
