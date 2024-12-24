import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFileCircleCheck, faPen, faTrash, faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faEye, faComment, faChevronUp, faChevronDown, faPlus, faMinus, faImage, faUser, faBell } from '@fortawesome/free-solid-svg-icons';

// 라이브러리에 아이콘 추가
library.add(solidBookmark, regularBookmark, faEye, faComment, faChevronUp, faChevronDown, faPlus, faMinus, faImage, faUser, faBell, faPen, faTrash, faFileCircleCheck);

export { FontAwesomeIcon };


