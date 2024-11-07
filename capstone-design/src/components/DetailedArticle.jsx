import { React, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { WriteButton } from "./AddArticle";
import { BodyBlurText, BodyText, EmphasisText } from "../pages/SignIn";
import MyStudentCard from "./MyStudentCard";
import StudentCard from "./StudentCard";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ReportIcon from "@mui/icons-material/Report";

const DetailedArticle = ({ articleInfo, userInfo, isApply }) => {
  const [open, setOpen] = useState(false); // 모달창 열기/닫기
  const [reportOpen, setReportOpen] = useState(false); // 신고하기 모달창 열기/닫기
  const [applicationPeople, setApplicationPeople] = useState(1); //신청인원
  ////////// 모달 열기 함수
  const handleOpen = () => setOpen(true);
  ////////// 모달 닫기 함수
  const handleClose = () => setOpen(false);

  ////////// 모달 열기 함수
  const handleReportOpen = () => setReportOpen(true);
  ////////// 신고하기 모달 닫기 함수
  const handleReportClose = () => setReportOpen(false);

  ////////// 매칭 신청하기 버튼 클릭
  const matchingApplyButtonClick = () => {
    matchingApply();
    addMatchingApplyCollection();
  };

  ////////// 매칭 취소하기 버튼 클릭
  const cancelMatchingApplyButtonClick = () => {
    cancelMatchingApply();
    deleteMatchingApplyCollection();
  };

  ////////// 게시물 매칭자 컬렉션에 신청자 정보 추가
  const matchingApply = async () => {
    const collectionName = articleInfo.uid + "_" + articleInfo.time;
    await setDoc(doc(db, `Matching/Application/${collectionName}`, userInfo.uid), {
      ...userInfo, // 신청자 정보 전달
      matching: false, // 매칭 여부는 false로 시작
      people: applicationPeople, // 신청인원
    });
    alert("매칭 신청 완료!");
  };

  ////////// 게시물 매칭자 컬렉션에 신청자 정보 삭제
  const cancelMatchingApply = async () => {
    const collectionName = articleInfo.uid + "_" + articleInfo.time;
    const docRef = doc(db, `Matching/Application/${collectionName}`, userInfo.uid);
    try {
      await deleteDoc(docRef);
      alert("매칭 취소 완료!");
    } catch (error) {
      alert("매칭 취소 실패!");
    }
  };

  //////// 내 매칭신청 게시물에 추가
  const addMatchingApplyCollection = async () => {
    const collectionName = userInfo.uid; // uid를 컬렉션명으로 설정하여 유저별로 매칭신청한 게시물 데이터 분리
    const docName = articleInfo.uid + "_" + articleInfo.time; // 게시물 고유 id를 문서명으로 설정
    await setDoc(doc(db, `user's (apply&scrap) article/apply/${collectionName}`, docName), {
      ...articleInfo, // 게시물 정보
    });
    console.log("신청한 게시물에 게시물 저장 완료");
  };

  //////// 내 매칭신청 게시물에서 삭제
  const deleteMatchingApplyCollection = async () => {
    const collectionName = userInfo.uid; // uid를 컬렉션명으로 설정하여 유저별로 매칭신청한 게시물 데이터 분리
    const docName = articleInfo.uid + "_" + articleInfo.time; // 게시물 고유 id를 문서명으로 설정
    const docRef = doc(db, `user's (apply&scrap) article/apply/${collectionName}`, docName);

    try {
      await deleteDoc(docRef);
      console.log(`문서가 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error("문서 삭제 중 오류 발생: ", error);
    }
  };

  ////////// 게시글 작성 시간
  const writeTimeStartIndex = articleInfo.time.indexOf("년") + 1; //년 다음부터
  const writeTimeEndIndex = articleInfo.time.indexOf("일") + 1; // 일까지
  const writeTime = articleInfo.time.substring(writeTimeStartIndex, writeTimeEndIndex);

  ////////// 희망 만남 시간
  const DateTimeYMDStartIndex = articleInfo.DateTime.indexOf("년") + 1; //년 다음부터
  const DateTimeYMDEndIndex = articleInfo.DateTime.indexOf("일") + 1; // 일까지
  const DateTimeHmStartIndex = articleInfo.DateTime.indexOf("일") + 1; //년 다음부터
  const DateTimeHmEndIndex = articleInfo.DateTime.indexOf("분") + 1; // 일까지
  const DateTimeYM = articleInfo.DateTime.substring(DateTimeYMDStartIndex, DateTimeYMDEndIndex);
  const DateTimeHm = articleInfo.DateTime.substring(DateTimeHmStartIndex, DateTimeHmEndIndex);
  // 정규 표현식을 사용하여 "01월 05일" 부분을 추출

  // 게시글 신고 함수
  const reportArticle = async () => {
    const reporterUid = userInfo.uid; // uid를 컬렉션명으로 설정하여 유저별로 매칭신청한 게시물 데이터 분리
    const articleId = articleInfo.uid + "_" + articleInfo.time; // 게시물 고유 id를 문서명으로 설정

    try {
      await setDoc(doc(db, `reported-articles/${articleId}/${reporterUid}`, reporterUid), {
        userInfo,
        articleInfo,
        reportTime: serverTimestamp(), // Firestore 서버 시간으로 타임스탬프 기록
      });

      alert("신고 완료🚨");
    } catch (error) {
      alert("오류 발생! 다시 시도해주세요.");
    }
  };
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  //////////////////////////////렌더링//////////////////////////////
  return (
    <>
      <SummaryContainer onClick={handleOpen}>
        {/* 학과 / 나이 / 성별 / 인원 .. 제목 */}
        <SummaryContent>
          {/* 윗줄 */}
          <SummaryInfoWrap>
            {/* 학과 나이 성별 인원 */}
            <SummaryInfo>
              {articleInfo.major} / {articleInfo.age} / {articleInfo.gender} / {articleInfo.people}인
            </SummaryInfo>
            {/* 날짜 */}
            <SummaryInfo>{writeTime}</SummaryInfo>
          </SummaryInfoWrap>
          {/* 아랫줄 */}
          {/* 제목 */}
          <SummaryInfoWrap2>
            <SummaryHeadline>{articleInfo.title}</SummaryHeadline>
            {/* 만남 희망 일시 */}
            <DateTimeContainer>
              <AccessAlarmIcon />
              <DateTimeWrap>
                <DateTimeText>{DateTimeYM}</DateTimeText>
                <DateTimeText>{DateTimeHm}</DateTimeText>
              </DateTimeWrap>
            </DateTimeContainer>
          </SummaryInfoWrap2>
        </SummaryContent>
      </SummaryContainer>
      {/* 모달 */}
      <StyledModal open={open} onClose={handleClose}>
        <StyledModalBox>
          {/* 신고하기 아이콘 */}
          <StyledReportIcon onClick={handleReportOpen} />
          {/* 신고하기 모달 */}
          <StyledModal open={reportOpen} onClose={handleReportClose}>
            <ReportModalBox>
              <DetailedHeadline>{articleInfo.title}</DetailedHeadline>
              <ReportButton onClick={reportArticle}>신고하기</ReportButton>
            </ReportModalBox>
          </StyledModal>
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
          {/* 이미 신청된 게시물은 인원 선택 폼 제거 */}
          {!isApply && (
            <SelectContainer variant="standard">
              <SelectLabel id="demo-simple-select-standard-label">인원</SelectLabel>
              <StyledSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                name="people"
                value={applicationPeople}
                onChange={(e) => setApplicationPeople(e.target.value)}
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
          )}

          {/* 매칭신청 버튼 */}
          <MatchingApplyButton onClick={isApply ? cancelMatchingApplyButtonClick : matchingApplyButtonClick}>
            {isApply ? "매칭 취소" : "매칭 신청"}
          </MatchingApplyButton>
        </StyledModalBox>
      </StyledModal>
    </>
  );
};

const ReportButton = styled(WriteButton)`
  background-color: red;
`;

const StyledReportIcon = styled(ReportIcon)`
  position: absolute;
  top: 12px;
  right: 12px;
  color: red;
`;

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

const ReportModalBox = styled(StyledModalBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const SummaryContainer = styled.div`
  width: 320px;
  height: 80px;
  border: 2px solid #739ff0;
  border-radius: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  /* background-color:pink; */
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

const DateTimeContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 80px;
  & .MuiSvgIcon-root {
    color: #26539c;
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
`;

const SummaryInfoWrap2 = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const DateTimeWrap = styled.div``;

const DateTimeText = styled(BodyText)`
  color: #26539c;
  text-align: right;
`;

const SummaryHeadline = styled(BodyText)`
  text-align: left;
  color: #26539c;
  height: 44px;
  overflow-y: hidden;
  width: 200px;
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
  margin-top: 20px;
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
  margin: 20px 0px;
`;

// 밑줄 인풋폼
const SelectContainer = styled(FormControl)`
  &.MuiFormControl-root {
    width: 220px;
    margin-top: 15px;
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

export default DetailedArticle;
