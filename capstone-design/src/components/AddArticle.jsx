import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import CloseIcon from "@mui/icons-material/Close";
import StudentCard from "./MyStudentCard";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from "dayjs";

const AddArticle = ({ userData }) => {
  const [open, setOpen] = React.useState(false); // 모달창 열기/닫기

  ////////// 모달 열기 함수
  const handleOpen = () => setOpen(true);
  ////////// 모달 닫기 함수
  const handleClose = () => setOpen(false);

  const [submitForm, setSubmitForm] = useState({}); // 게시글 정보

  ////////// 프롭스 데이터 변경(ex) 유저정보 로드 등으로 인한 데이터 변경) 시 submitForm 에 변경된 데이터 반영
  useEffect(() => {
    setSubmitForm({ ...userData, expiration: false });
  }, [userData]);

  ////////// 입력폼 입력 감지 함수
  const onChange = (e) => {
    const nextForm = {
      ...submitForm, // 기존 submitForm을 복사하여
      [e.target.name]: e.target.value, // event가 발생한 input 요소의 name 값을 입력값으로 변경
    };
    setSubmitForm(nextForm); // 수정 내용 갱신
  };

  ////////// 게시글 등록 함수
  const addArticle = async () => {
    if (submitForm.title && submitForm.content) {
      const timeStamp = currentTime(); // 게시글 등록 시간
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
    const month = String(t.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고, padStart로 두 자리로 만듭니다.
    const day = String(t.getDate()).padStart(2, "0"); // 일도 padStart로 두 자리로 만듭니다.
    const hours = String(t.getHours()).padStart(2, "0"); // 시도 padStart로 두 자리로 만듭니다.
    const minutes = String(t.getMinutes()).padStart(2, "0"); // 분도 padStart로 두 자리로 만듭니다.
    const seconds = String(t.getSeconds()).padStart(2, "0"); // 초도 padStart로 두 자리로 만듭니다.
    const returnTime = `${year}년${month}월${day}일${hours}시${minutes}분${seconds}초`;
    return returnTime;
  };

  useEffect(() => {
    console.log("submitForm변경>>", submitForm);
  }, [submitForm]);

  const [meatingDate, setMeatingDate] = useState(null);

  useEffect(() => {
    console.log("meatingDate변경>>", meatingDate);
  }, [meatingDate]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      {/* 모달 전 */}
      <WriteButton onClick={handleOpen}>글쓰기</WriteButton>
      {/* 모달 후*/}
      <Modal open={open} onClose={handleClose}>
        <ModalContainer>
          <ModalBox>
            {/* 닫기 아이콘 */}
            <StyledCloseIcon onClick={handleClose} />
            {/* 학생증 */}
            <StudentCard style={{ margin: "20px 0px" }} />
            {/* 인풋 */}
            {/* 카테고리 */}
            <SelectContainer variant="standard" sx={{ m: 1, minWidth: 220, minHeight: 30 }}>
              <SelectLabel id="demo-simple-select-standard-label">카테고리</SelectLabel>
              <StyledSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                name="category"
                value={submitForm.category}
                onChange={onChange}
                label="카테고리"
              >
                <StyledMenuItem value="밥팅">밥팅</StyledMenuItem>
                <StyledMenuItem value="스터팅">스터팅</StyledMenuItem>
                <StyledMenuItem value="과팅">과팅</StyledMenuItem>
              </StyledSelect>
            </SelectContainer>
            {/* 인원 */}
            <SelectContainer variant="standard">
              <SelectLabel id="demo-simple-select-standard-label">인원</SelectLabel>
              <StyledSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                name="people"
                value={submitForm.people}
                onChange={onChange}
                label="인원"
              >
                <StyledMenuItem value={1}>1인</StyledMenuItem>
                <StyledMenuItem value={2}>2인</StyledMenuItem>
                <StyledMenuItem value={3}>3인</StyledMenuItem>
                <StyledMenuItem value={4}>4인</StyledMenuItem>
                <StyledMenuItem value={5}>5인</StyledMenuItem>
                <StyledMenuItem value={6}>6인</StyledMenuItem>
              </StyledSelect>
            </SelectContainer>
            {/* 날짜 */}
            {/* <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ monthShort: `M` }}> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DateTimePicker
                  showDaysOutsideCurrentMonth
                  format="YYYY-MM-DD"
                  label="날짜 및 시간"
                  value={meatingDate||dayjs()}
                  onChange={(newValue) => setMeatingDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
            {/* 제목 */}
            <StyledInput
              label="제목"
              name="title"
              value={submitForm.title}
              multiline
              maxRows={1}
              onChange={onChange}
              style={{ marginBottom: "15px" }}
            />
            {/* 내용 */}
            <StyledInput
              label="내용"
              name="content"
              value={submitForm.content}
              multiline
              rows={5}
              onChange={onChange}
              style={{ marginBottom: "20px" }}
            />
            <WriteButton onClick={addArticle}>글쓰기</WriteButton>
          </ModalBox>
        </ModalContainer>
      </Modal>
    </>
  );
};

const StyledInput = styled(TextField)`
  width: 220px;
  /* 컨테이너 */
  & .MuiInputBase-root .MuiOutlinedInput-notchedOutline {
    border-color: #26539c;
  }
  /* 라벨 */
  & .MuiFormLabel-root {
    color: #26539c;
    font-family: "Pretendard-Regular";
  }
  /* 인풋 폰트 */
  & .MuiInputBase-root {
    font-family: "Pretendard-Regular";
  }
`;

// 글쓰기 버튼
export const WriteButton = styled.button`
  background-color: #4d207a;
  width: 150px;
  height: 40px;
  border-radius: 10px;
  border: 0px;
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
  height: 600px;
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
  top: 10px;
  right: 10px;
  &:hover {
    cursor: pointer;
  }
`;

// 밑줄 인풋폼
const SelectContainer = styled(FormControl)`
  &.MuiFormControl-root {
    width: 220px;
    margin: 0px;
    margin-bottom: 15px;
  }
`;

const SelectLabel = styled(InputLabel)`
  /* 라벨 텍스트 스타일 변경 */
  &.MuiFormLabel-root {
    color: #26539c;
    font-family: "Pretendard-Regular";
  }
`;

const StyledSelect = styled(Select)`
  /* 클릭 전후 보더 컬러 변경 */
  &.MuiInputBase-root::before {
    border-bottom-color: #26539c;
  }
  &.MuiInputBase-root::after {
    border-bottom-color: #26539c;
  }

  /* 폰트 변경 */
  &.MuiInputBase-root {
    font-family: "Pretendard-Regular";
  }

  /* 아이콘 색상 변경  */
  & .MuiSvgIcon-root {
    color: #26539c;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  &.MuiButtonBase-root {
    font-family: "Pretendard-Regular";
  }
`;
export default AddArticle;
