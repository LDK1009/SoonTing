import { collection, doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import { CategortItemButton } from "./Main";
import styled from "styled-components";
import { Divider } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Header from "../components/Header";
import { BodyText } from "./SignIn";
import { WriteButton } from "../components/AddArticle";

const MyArticle = () => {
  const navProps = useLocation(); // useNavigate 프롭스 전달 받기
  const Uid = navProps.state.uid; // 네비게이트로 전달 받은 uid
  const [expiredArticles, setExpiredArticles] = useState([]); // 만료된 게시물(1차원 배열)
  const [unExpiredArticles, setUnExpiredArticles] = useState([]); // 만료되지 않은 게시물(1차원 배열)
  const [allApplication, setAllApplication] = useState([[], []]); // 모든 게시물의 모든 신청자 정보(2차원 배열)
  const [allMatchingUser, setAllMatchingUser] = useState([[], []]); // 모든 게시물의 모든 신청자 정보(2차원 배열)
  const [isLoadExpired, setIsLoadExpired] = useState(false); // 불러올 게시물 스위치(만료 전/후)

  ///
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  ////////// 게시글 불러오기
  const getMyArticles = async (expiration) => {
    // 유저의 uid와 일치한 게시글을 모두 불러와 만료 여부에 따라 데이터를 분류해 담는다.
    const articlesRef = collection(db, "articles"); // articles 컬렉션 참조
    const q = query(
      articlesRef,
      where("uid", "==", Uid), // uid가 일치한 게시글
      where("expiration", "==", expiration), // 만료 여부
      orderBy("time", "desc") // 시간순 정렬
    ); // 최근 게시글이 최상단에 위치

    const querySnapshot = await getDocs(q); // 조건에 부합한 모든 문서를 querySnapshot에 담는다.
    const newData = []; // 받아온 데이터 담을 배열

    // 데이터 옮겨 담기
    querySnapshot.forEach((doc) => {
      newData.push(doc.data()); // querySnapshot에 담긴 문서의 데이터만 골라서 커스텀 배열에 옮겨 담는다.
    });

    // 만료 여부에 따른 데이터 분류
    if (expiration === false) {
      setUnExpiredArticles(() => newData);
    } else {
      setExpiredArticles(() => newData);
    }
  };

  ////////// 신청내역 불러오기
  const getApplication = async (articleTitle) => {
    // 매개변수를 통해 게시물(컬렉션)을 찾는다. // 해당 게시물의 모든 매칭 신청자의 데이터를 배열에 담아 반환한다
    const q = query(collection(db, `Matching/Application/${articleTitle}`)); // 인자로 받은 컬렉션명으로 해당 게시글에 신청된 문서들을 찾고 newData에 저장한다.
    const querySnapshot = await getDocs(q); // 쿼리로 찾은 컬렉션의 모든 문서를 querySnapshot변수에 담는다.

    // 문서의 데이터(유효 객체)만 추출하여 newData에 담는다
    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push(doc.data()); // 배열에 객체들을 담는다.
    });

    // newData를 반환한다.
    return newData;
  };

  ////////// 매칭확정자 불러오기
  const getMatcingUser = async (articleTitle) => {
    // 매개변수를 통해 게시물(컬렉션)을 찾는다. // 해당 게시물의 모든 매칭 신청자의 데이터를 배열에 담아 반환한다
    const q = query(collection(db, `Matching/MatchingUser/${articleTitle}`)); // 인자로 받은 컬렉션명으로 해당 게시글에 신청된 문서들을 찾고 newData에 저장한다.
    const querySnapshot = await getDocs(q); // 쿼리로 찾은 컬렉션의 모든 문서를 querySnapshot변수에 담는다.

    // 문서의 데이터(유효 객체)만 추출하여 newData에 담는다
    const newData = [];
    querySnapshot.forEach((doc) => {
      newData.push(doc.data()); // 배열에 객체들을 담는다.
    });

    // newData를 반환한다.
    return newData;
  };

  ////////// 전체 신청내역 불러오기
  const getAllApplication = async (articles) => {
    // 매개변수(모든 게시글)의 모든 신청자 정보를 2차원 배열 형태로 받아와 allApplication 상태 변수에 갱신한다. 예) 첫번째 게시글의 신청 내역은 [0][0], [0][1], ... 두번째 게시글의 신청 내역은 [1][0], [1][1], ...
    const arrayLength = articles.length; // 게시글 개수(행의 수)
    const newData = []; // 해당 게시글의 신청 내역을 담을 변수
    for (let i = 0; i < arrayLength; i++) {
      // 게시글 개수 만큼 반복
      const collectionName = articles[i].uid + "_" + articles[i].time; // 게시글 컬렉션명
      const buffer = await getApplication(collectionName); // 해당 게시글의 모든 신청 내역을 변수에 대입.
      newData.push(buffer); //
    }
    setAllApplication(newData); // allApplication 상태 변수 갱신
  };

  ////////// 전체 매칭확정자 불러오기
  const getAllMatcingUser = async (articles) => {
    // 해당 게시물의 매칭 확정자를 모두 가져온다. 매개변수에 만료된 게시물을 넣음
    // 매개변수(모든 게시글)의 모든 신청자 정보를 2차원 배열 형태로 받아와 allApplication 상태 변수에 갱신한다. 예) 첫번째 게시글의 신청 내역은 [0][0], [0][1], ... 두번째 게시글의 신청 내역은 [1][0], [1][1], ...
    const arrayLength = articles.length; // 게시글 개수(행의 수)
    const newData = []; // 해당 게시글의 매칭 확정자를 담을 배열
    for (let i = 0; i < arrayLength; i++) {
      // 게시글 개수 만큼 반복
      const collectionName = articles[i].uid + "_" + articles[i].time; // 게시글 컬렉션명
      const buffer = await getMatcingUser(collectionName); // 해당 게시글의 모든 신청 내역(배열)을 변수에 대입. 배열에 배열을 연속적으로 push하여 2차원 배열이 생성된다.
      newData.push(buffer); //
    }
    setAllMatchingUser(newData); // allApplication 상태 변수 갱신
  };

  ////////// 매칭하기
  const matching = async (docName, matchingUserInfo) => {
    // articles 컬렉션에서 문서명이 docName 인 문서를 찾아 만료 여부를 변경하고 매칭된 상대의 정보를 입력한다.
    const applicationDocRef = doc(db, `Matching/Application/${docName}`, matchingUserInfo.uid);
    await setDoc(applicationDocRef, { matching: true }, { merge: true }); // 매칭 확정
    const mathingUserDocRef = doc(db, `Matching/MatchingUser/${docName}`, matchingUserInfo.uid);
    await setDoc(mathingUserDocRef, { ...matchingUserInfo, expiration: true }); // 매칭 확정자에 넣기
    alert("매칭 완료! 😘");
    getMyArticles(false);
    getMyArticles(true);
  };

  ////////// 게시물 마감
  const expireArticle = async (docName) => {
    const articleDocRef = doc(db, "articles", docName);
    await setDoc(articleDocRef, { expiration: true }, { merge: true }); // 게시글 마감
    alert("마감 되었습니다✔");
    // window.location.reload();
    getMyArticles(false);
    getMyArticles(true);
  };

  ////////// 미만료 게시글&신청내역 렌더링
  const renderUnExpiredArticles = (articles, allApplication) => {
    // 모든 게시글 배열과 모든 게시물의 모든 신청자 정보 2차원 배열을 받아 게시물1-게시물1의 신청내역들 / 게시물2-게시물2의 신청내역들 을 번갈아 렌더링한다.
    return (
      <>
        {articles.map((item, index) => {
          // 모든 게시물 배열을 순회하며 렌더링 for문 생각하면 편함
          const collectionName = item.uid + "_" + item.time; // 게시물의 문서명 || 컬렉션명
          const aplicationOfArticle = allApplication[index] || []; // 해당 게시물의 모든 신청자 정보를 변수에 대입

          return (
            <div key={index}>
              <SummaryList component="nav" aria-labelledby="nested-list-subheader">
                {/* 헤더 */}
                <ListItemButton onClick={handleClick}>
                  <SummaryListIcon />
                  <ArticleHeader>{item.title}</ArticleHeader>
                  <div>{open ? <ExpandLess /> : <ExpandMore />}</div>
                </ListItemButton>
                {/* 드롭다운 */}
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {aplicationOfArticle.map((item2, index2) => {
                      // 해당 게시물의 모든 신청자 정보를 순회하며 렌더링
                      return (
                        <>
                          <ApplicantInfoContainer key={index2}>
                            <StudentCard info={item2} />
                            {item2.matching ? (
                              <ConfirmButton>확정</ConfirmButton>
                            ) : (
                              <MatchingButton onClick={() => matching(collectionName, item2)}>매칭</MatchingButton>
                            )}
                          </ApplicantInfoContainer>
                        </>
                      );
                    })}
                    <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                      <ExprireButton onClick={() => expireArticle(collectionName)}>마감하기</ExprireButton>
                    </div>
                  </List>
                </Collapse>
              </SummaryList>
              {!open && <Divider />}
            </div>
          );
        })}
      </>
    );
  };

  ////////// 만료 게시글 렌더링
  const renderExpiredArticles = (articles, allMatcingUser) => {
    // 모든 게시글 배열과 모든 게시물의 모든 신청자 정보 2차원 배열을 받아 게시물1-게시물1의 신청내역들 / 게시물2-게시물2의 신청내역들 을 번갈아 렌더링한다.

    return (
      <>
        {articles.map((item, index) => {
          const aplicationOfArticle = allMatcingUser[index] || []; // 해당 게시물의 모든 신청자 정보를 변수에 대입
          // 모든 게시물 배열을 순회하며 렌더링 for문 생각하면 편함
          // const collectionName = item.uid + "_" + item.time; // 게시물의 문서명 || 컬렉션명

          return (
            <div key={index}>
              <SummaryList component="nav" aria-labelledby="nested-list-subheader">
                {/* 헤더 */}
                <ListItemButton onClick={handleClick}>
                  <DetailListIcon />
                  <ArticleHeader>{item.title}</ArticleHeader>
                  <div>{open ? <ExpandLess /> : <ExpandMore />}</div>
                </ListItemButton>
                {/* 드롭다운 */}
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {aplicationOfArticle.map((item2, index2) => {
                      // 해당 게시물의 모든 신청자 정보를 순회하며 렌더링
                      return (
                        <>
                          <ApplicantInfoContainer key={index2}>
                            <StudentCard info={item2} />
                            <ConfirmButton>확정</ConfirmButton>
                          </ApplicantInfoContainer>
                        </>
                      );
                    })}
                  </List>
                </Collapse>
              </SummaryList>
              {!open && <Divider />}
            </div>
          );
        })}
      </>
    );
  };

  ////////// 마운트
  useEffect(() => {
    getMyArticles(false);
    getMyArticles(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////// unExpiredArticles 변경 시(미만료 게시물 로드 완료 시)
  useEffect(() => {
    getAllApplication(unExpiredArticles); // 모든 게시물의 신청자 데이터를 갱신한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unExpiredArticles]);

  ////////// expiredArticles 변경 시(만료 게시물 로드 완료 시)
  useEffect(() => {
    console.log("expiredArticles변경>>\n", expiredArticles);
    getAllMatcingUser(expiredArticles); // 모든 게시물의 신청자 데이터를 갱신한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiredArticles]);

  useEffect(() => {
    console.log(allMatchingUser);
  }, [allMatchingUser]);
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <Header />
      <Container>
        {/* 버튼 */}
        <ButtonGroup>
          <FilterButton isSelect={!isLoadExpired} onClick={() => setIsLoadExpired(false)}>
            마감 전
          </FilterButton>
          <FilterButton isSelect={isLoadExpired} onClick={() => setIsLoadExpired(true)}>
            마감 후
          </FilterButton>
        </ButtonGroup>
        {/* 게시물 */}
        <ArticlesContainer>
          {isLoadExpired
            ? renderExpiredArticles(expiredArticles, allMatchingUser)
            : renderUnExpiredArticles(unExpiredArticles, allApplication)}
        </ArticlesContainer>
      </Container>
    </>
  );
};

// 최상위 컨테이너(흰 배경)
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 전체 게시물 컨테이너
const ArticlesContainer = styled.div`
  height: 600px;
  width: 300px;
  padding: 0px 10px;
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

//매칭 전/후 버튼 그룹
const ButtonGroup = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 10px;
`;

// 매칭 전/후 버튼
const FilterButton = styled(CategortItemButton)`
  width: 140px;
  height: 40px;
  font-size: 16px;
`;

// 드롭다운 게시물 제목
const ArticleHeader = styled(BodyText)`
  color: #111111;
  width: 200px;
  height: 44px;
  overflow: hidden;
`;

// 드롭다운 신청자 정보 컨테이너
const ApplicantInfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
`;

// 매칭 버튼
const MatchingButton = styled.button`
  width: 50px;
  height: 50px;
  margin-left: 10px;
  background-color: #cfbc5d;
  border: 0px;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: "Pretendard-Regular";
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

// 확정 버튼
const ConfirmButton = styled(MatchingButton)`
  background-color: #26539c;
  &:hover {
    cursor: auto;
    opacity: 1;
  }
`;

//마감하기 버튼
const ExprireButton = styled(WriteButton)`
  width: 100%;
`;

const SummaryList = styled(List)`
  /* 전체 컨테이너 */
  width: 100%;
  /* 리스트 아이템(펼치기 전) */
  & .MuiButtonBase-root {
    height: 50px;
    padding: 0px;
    justify-content: space-between;
    margin: 10px 0px;
  }
`;

const SummaryListIcon = styled(CircleRoundedIcon)`
  &.MuiSvgIcon-root {
    width: 24px;
    height: 24px;
    color: #72c6ef;
  }
`;

const DetailListIcon = styled(CheckCircleRoundedIcon)`
  &.MuiSvgIcon-root {
    width: 24px;
    height: 24px;
    color: #72c6ef;
  }
`;

// 학생증
const StudentCard = ({ info }) => {
  const applicantInfo = info;
  return (
    <>
      <StudentCardContainer>
        <StudentCardTop>
          <StudentCardSCH>SCH</StudentCardSCH>
          <StudentCardPeople>4인</StudentCardPeople>
          {/* <StudentCardPeople>{applicantInfo.people}</StudentCardPeople> */}
        </StudentCardTop>
        <StudentCardText>{applicantInfo.name}</StudentCardText>
        <StudentCardText>{applicantInfo.major}</StudentCardText>
        <StudentCardText>
          {applicantInfo.gender} / {applicantInfo.age}세
        </StudentCardText>
        <StudentCardText>
          {applicantInfo.matching && applicantInfo.number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}
        </StudentCardText>
      </StudentCardContainer>
    </>
  );
};

const StudentCardContainer = styled.div`
  width: 220px;
  height: 120px;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
  overflow: hidden;
`;

const StudentCardTop = styled.div`
  position: relative;
  background-color: #26539c;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StudentCardSCH = styled.div`
  color: white;
  font-size: 20px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
`;

const StudentCardPeople = styled(BodyText)`
  position: absolute;
  right: 10px;
`;

const StudentCardText = styled(BodyText)`
  color: #111111;
  font-size: 12px;
`;

export default MyArticle;
