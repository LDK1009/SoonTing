import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { TextField } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AddArticle = ({ userData }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log("이거이거!!", userData);
  // 게시글 정보
  const [form, setForm] = useState({
    uid: userData.uid,
    name: userData.name,
    gender: userData.gender,
    age: userData.age,
    people: userData.people,
    major: userData.major,
    title: "",
    content: "",
    expiration: false,
  });

  ////////// 입력 감지
  const onChange = (e) => {
    const nextForm = {
      ...form, // 기존 form을 복사하여
      [e.target.name]: e.target.value, // event가 발생한 input 요소의 name 값을 입력값으로 변경
    };
    setForm(nextForm); // 수정 내용 갱신
    console.log(form.title);
  };

  ////////// 게시글 등록
  const addArticle = async () => {
    if (form.title && form.content) {
      const timeStamp = currentTime();
      const docName = `${form.uid}_${timeStamp}`; // 수정된 부분
      await setDoc(doc(db, "articles", docName), {
        ...form,
        time: timeStamp,
      });
      alert("게시글이 등록되었습니다😉");
      clearForm();
    } else {
      alert("게시글을 모두 작성해주세요😥");
    }
  };

  const clearForm = () => {
    const nextForm = {
      ...form, // 기존 form을 복사하여
      title: "",
      content: "",
    };
    setForm(nextForm); // 수정 내용 갱신
    console.log(form.title);
  };

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
          <div> 이름 : {userData.name}</div>
          <div> 학과 : {userData.major}</div>
          <div> 성별 : {userData.gender}</div>
          <div> 나이 : {userData.age}</div>
          <div> 팀원 수 : {userData.people}</div>
          <TextField
            label="제목"
            name="title"
            value={form.title}
            multiline
            maxRows={1}
            onChange={onChange}
          />
          <TextField
            label="내용"
            name="content"
            value={form.content}
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
