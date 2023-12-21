import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { TextField } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AddArticle = ({ userData }) => {
  const [open, setOpen] = React.useState(false); // 모달창 열기/닫기
  const [submitForm, setSubmitForm] = useState({}); // 게시글 정보

  ////////// 모달 열기 함수
  const handleOpen = () => setOpen(true);
  ////////// 모달 닫기 함수
  const handleClose = () => setOpen(false);

  ////////// 프롭스 데이터 변경(ex) 유저정보 로드 등으로 인한 데이터 변경) 시 submitForm 에 변경된 데이터 반영
  useEffect(() => {
    setSubmitForm({ ...userData, title: "", content: "", expiration: false });
  }, [userData]);

  ////////// 입력폼 입력 감지 함수
  const onChange = (e) => {
    const nextForm = {
      ...submitForm, // 기존 submitForm을 복사하여
      [e.target.name]: e.target.value, // event가 발생한 input 요소의 name 값을 입력값으로 변경
    };
    setSubmitForm(nextForm); // 수정 내용 갱신
    // console.log(submitForm.title);
  };

  ////////// 게시글 등록 함수
  const addArticle = async () => {
    if (submitForm.title && submitForm.content) {
      const timeStamp = currentTime();
      const docName = `${submitForm.uid}_${timeStamp}`; // 수정된 부분
      await setDoc(doc(db, "articles", docName), {
        ...submitForm,
        time: timeStamp,
      });
      alert("게시글이 등록되었습니다😉");
      clearForm();
    } else {
      alert("게시글을 모두 작성해주세요😥");
    }
  };

  ////////// 입력 폼 초기화 함수
  const clearForm = () => {
    const nextForm = {
      ...submitForm, // 기존 submitForm을 복사하여
      title: "",
      content: "",
    };
    setSubmitForm(nextForm); // 수정 내용 갱신
    // console.log(submitForm.title);
  };

  ////////// 현재 시간 반환 함수
  const currentTime = () => {
    // 현재 시각을 나타내는 JavaScript Date 객체 생성
    const t = new Date();
    // 년, 월, 일, 시, 분, 초 추출
    const year = t.getFullYear();
    const month = t.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = t.getDate();
    const hours = t.getHours();
    const minutes = t.getMinutes();
    const seconds = t.getSeconds();
    const returnTime = `${year}년${month}월${day}일${hours}시${minutes}분${seconds}초`;
    return returnTime;
  };

  return (
    <>
      <button onClick={handleOpen}>글쓰기</button>
      <Modal open={open} onClose={handleClose}>
        <StyledModalBox>
          <div>모달 창 테스트!</div>
          <div> 이름 : {submitForm.name}</div>
          <div> 학과 : {submitForm.major}</div>
          <div> 성별 : {submitForm.gender}</div>
          <div> 나이 : {submitForm.age}</div>
          <div> 팀원 수 : {submitForm.people}</div>
          <TextField
            label="제목"
            name="title"
            value={submitForm.title}
            multiline
            maxRows={1}
            onChange={onChange}
          />
          <TextField
            label="내용"
            name="content"
            value={submitForm.content}
            multiline
            rows={6}
            onChange={onChange}
          />
          <button onClick={addArticle}>글쓰기</button>
        </StyledModalBox>
      </Modal>
    </>
  );
};

const StyledModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 500px;
  background-color: white;
  border-radius: 15px;
`;

export default AddArticle;
