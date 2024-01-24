import { React, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { WriteButton } from "./AddArticle";
import { BodyBlurText, BodyText, EmphasisText } from "../pages/SignIn";
import MyStudentCard from "./MyStudentCard";
import StudentCard from "./StudentCard";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const DetailedArticle = ({ articleInfo, userInfo }) => {
  const [open, setOpen] = useState(false); // 모달창 열기/닫기
  const [applicationPeople, setApplicationPeople] = useState(1); //신청인원
  ////////// 모달 열기 함수
  const handleOpen = () => setOpen(true);
  ////////// 모달 닫기 함수
  const handleClose = () => setOpen(false);

  ////////// 매칭 신청하기
  const matchingApply = async () => {
    const collectionName = articleInfo.uid + "_" + articleInfo.time;
    await setDoc(doc(db, `Matching/Application/${collectionName}`, userInfo.uid), {
      ...userInfo, // 신청자 정보 전달
      matching: false, // 매칭 여부는 false로 시작
      people:applicationPeople, // 신청인원
    });
    alert("매칭 신청 완료!");
  };

  ////////// 게시글 시간
  const startIndex = articleInfo.time.indexOf("년") + 1; //년 다음부터
  const endIndex = articleInfo.time.indexOf("일") + 1; // 일까지
  const writeTime = articleInfo.time.substring(startIndex, endIndex);

  // 정규 표현식을 사용하여 "01월 05일" 부분을 추출
  return (
    <>
      <SummaryContainer onClick={handleOpen}>
        {/* 학과 / 나이 / 성별 / 인원 .. 제목 */}
        <SummaryContent>
          <SummaryInfoWrap>
            {/* 학과 나이 성별 인원 */}
            <SummaryInfo>
              {articleInfo.major} / {articleInfo.age} / {articleInfo.gender} / {articleInfo.people}인
            </SummaryInfo>
            {/* 날짜 */}
            <SummaryInfo>{writeTime}</SummaryInfo>
          </SummaryInfoWrap>
          {/* 제목 */}
          <SummaryHeadline>{articleInfo.title}</SummaryHeadline>
        </SummaryContent>
      </SummaryContainer>
      {/* 모달 */}
      <StyledModal open={open} onClose={handleClose}>
        <StyledModalBox>
          {/* 제목 */}
          <DetailedHeadline>{articleInfo.title}</DetailedHeadline>
          {/* 내용 */}
          <DetailedContent>{articleInfo.content}</DetailedContent>
          {/* 작성자 학생증 */}
          <StudentCard info={articleInfo} />
          <Hr />
          {/* 신청자 학생증 */}
          <MyStudentCard style={{ position: "relative" }}>
            <ApplicationPeople>{applicationPeople}인</ApplicationPeople>
          </MyStudentCard>
          {/* 인원 인풋 */}
          <SelectContainer variant="standard">
              <SelectLabel id="demo-simple-select-standard-label">인원</SelectLabel>
              <StyledSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                name="people"
                value={applicationPeople}
                onChange={(e)=>setApplicationPeople(e.target.value)}
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
          {/* 매칭신청 버튼 */}
          <MatchingApplyButton onClick={matchingApply}>매칭 신청</MatchingApplyButton>
        </StyledModalBox>
      </StyledModal>
    </>
  );
};
const StyledModal = styled(Modal)`
  &:focus-visible {
    outline: 0px;
  }
`;

const StyledModalBox = styled(Box)`
  &:focus-visible {
    outline: 0px;
  }
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 15px;
  border: 0px;
`;

const SummaryContainer = styled.div`
  width: 300px;
  height: 80px;
  border: 2px solid #72c6ef;
  border-radius: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const SummaryContent = styled.div`
  margin: 0px 10px;
  width: 100%;
`;

const SummaryInfo = styled(BodyBlurText)`
  font-size: 12px;
  color: #767676;
`;

const SummaryInfoWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const SummaryHeadline = styled(BodyText)`
  text-align: left;
  color: #111111;
  height: 44px;
  overflow-y: hidden;
`;

const DetailedHeadline = styled(EmphasisText)`
  color: #111111;
  width: 250px;
  height: 56px;
  overflow: hidden;
  margin: 10px 0px;
`;

const DetailedContent = styled(BodyText)`
  color: #111111;
  width: 250px;
  height: 88px;
  margin-bottom: 10px;
  padding: 0px 5px;
  text-align: left;
  overflow: auto;

  /* Chrome, Safari, Opera*/
  &::-webkit-scrollbar {
    width: 3px;
    background-color: white;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d2daff;
  }
  &::-webkit-scrollbar-track {
    background-color: whitesmoke;
  }
`;

const MatchingApplyButton = styled(WriteButton)`
margin-top:20px;
`;

const ApplicationPeople = styled(BodyText)`
  position: absolute;
  right: 10px;
`;

const Hr = styled.hr`
  width: 250px;
  height: 2px;
  border: 0px;
  background-color: #4d207a;
  margin:20px 0px;
`;

// 밑줄 인풋폼
const SelectContainer = styled(FormControl)`
  &.MuiFormControl-root {
    width: 220px;
    margin-top:15px;
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
  &.MuiInputBase-root::before{
    border-bottom-color: #26539c;
  }
  &.MuiInputBase-root::after{
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
export default DetailedArticle;
