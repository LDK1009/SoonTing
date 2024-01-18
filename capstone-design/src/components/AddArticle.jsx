import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { TextField } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const AddArticle = ({ userData }) => {
  const [open, setOpen] = React.useState(false); // 모달창 열기/닫기
  const [submitForm, setSubmitForm] = useState({}); // 게시글 정보
  const navigate = useNavigate(); // 네비게이트 변수

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

  ////////// 고정 정보 클릭 시 경고
  const alertFixedInfo = () => {
    alert("'내정보' 페이지에서 변경해주세요.😉");
    if (window.confirm("'내정보' 페이지로 이동할까요?🧐")) {
      navigate("/MyInfo", {
        state: { uid: userData.uid },
      });
    } else {
    }
  };

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <WriteButton onClick={handleOpen}>글쓰기</WriteButton>
      <Modal open={open} onClose={handleClose}>
        <ModalContainer>
          <ModalBox>
            <StyledCloseIcon onClick={handleClose} />
            <h2>글쓰기</h2>
            <FixedInfo onClick={alertFixedInfo}>
              {submitForm.name} / {submitForm.major} / {submitForm.gender} / {submitForm.age}세
            </FixedInfo>
            <FixedInfo onClick={alertFixedInfo}>인원 : {submitForm.people}인</FixedInfo>
            <StyledInput label="제목" name="title" value={submitForm.title} multiline maxRows={1} onChange={onChange} />
            <GapDiv />
            <StyledInput
              label="내용"
              name="content"
              value={submitForm.content}
              multiline
              rows={6}
              onChange={onChange}
            />
            <WriteButton onClick={addArticle}>글쓰기</WriteButton>
          </ModalBox>
        </ModalContainer>
      </Modal>
    </>
  );
};

const StyledInput = styled(TextField)`
  width: 250px;
`;

// 글쓰기 버튼
export const WriteButton = styled.button`
  background-color: #4d207a;
  width: 150px;
  height: 40px;
  border-radius: 10px;
  border:0px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: "Pretendard-Regular";
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

const ModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 480px;
  padding: 10px;
  background-color: white;
  border-radius: 15px;
`;

const ModalBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 0px;
  right: 0px;
  &:hover {
    cursor: pointer;
  }
`;

const FixedInfo = styled.div`
  margin-bottom: 10px;
`;

const GapDiv = styled.div`
  margin: 10px;
`;

export default AddArticle;
