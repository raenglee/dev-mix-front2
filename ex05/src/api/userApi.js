import axios from 'axios';
import { GLOBAL_URL } from './util';
<<<<<<< HEAD

// const url = 'http://192.168.0.61:8080';
// const url = 'http://localhost:8080/api/v1/users';
const url = `${GLOBAL_URL}/api/v1/boards`;

=======
// const url = 'http://192.168.0.61:8080';

const url = `${GLOBAL_URL}/api/v1/users`;
>>>>>>> jh

//특정 유저 프로필 
export const getUserInfo = async (user_id) => {
  // console.log('특정 유저 프로필api user_id: ',user_id);
    try {
      const res = await axios.get(`${url}/${user_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // console.log('타유저정보 res값',res);
      return res;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

//프로필 수정
  export const patchUserInfo = async (user_id) => {
    try {
      const res = await axios.patch(`${url}/${user_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return err;
    }
  };



// 내가 작성한 게시글
export const userboards = async (user_id) => {
  try {
    const res = await axios.get(`${url}/${user_id}/boards`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    // console.log('내가 작성한 게시글 Api', res);
    return res.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

// 내가 작성한 댓글
export const usercomments = async (user_id) => {
  try {
    const res = await axios.get(`${url}/${user_id}/comments`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    // console.log('내가 작성한 댓글 Api', res);
    return res.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};