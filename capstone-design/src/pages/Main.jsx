import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import AddArticle from "../components/AddArticle";
import DetailedArticle from "../components/DetailedArticle";
import styled from "styled-components";
import Header from "../components/Header";
import categoryImg1 from "../assets/밥팅.png";
import categoryImg2 from "../assets/스터팅.png";
import categoryImg3 from "../assets/과팅.png";

const Main = () => {
  // 카테고리 상태
  const [categoryState, setCategoryState] = useState({
    babting: true,
    stuting: false,
    guating: false,
  });

  useEffect(() => {
    console.log(categoryState);
  }, [categoryState]);
  // 카테고리 상태변경 함수

  const changeCategory = (category) => {
    switch (category) {
      case "babting":
        setCategoryState({
          babting: true,
          stuting: false,
          guating: false,
        });
        console.log("카테고리클릭!");
        break;
      case "stuting":
        setCategoryState({
          babting: false,
          stuting: true,
          guating: false,
        });
        console.log("카테고리클릭!");
        break;
      case "guating":
        setCategoryState({
          babting: false,
          stuting: false,
          guating: true,
        });
        console.log("카테고리클릭!");
        break;
      default:
        console.log("카테고리클릭! 하지만 아무일도 없었다");
        break;
    }
  };

  const location = useLocation(); // useNavigate 프롭스 전달 받기(uid)
  const userUid = location.state.uid; // uid
  const navigate = useNavigate(); // 네비게이트 변수
  const [loadedArticles, setLoadedArticles] = useState([]); // 로드한 게시글

  ////////// 유저아이디를 기반으로 회원 정보 가져오기
  const [userData, setUserData] = useState({
    uid: "",
    name: "",
    email: "",
    gender: "",
    age: "",
    people: "",
    major: "",
    number: "",
  });

  ////////// 유저 정보 불러오기
  const readUserInfo = async () => {
    // DB에 문서명이 uid인 문서가 있는지 확인하고 있다면 해당 유저 정보를 가져오기
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // setUserData(() => docSnap.data());
      // console.log("문서 가져오는중");
      const userDataFromDb = docSnap.data();
      setUserData(userDataFromDb);
      console.log("문서 가져오는 중");
      // 데이터 업데이트 후에 isEnterUserInfo 함수 호출
      isEnterUserInfo(userDataFromDb);
    } else {
      // docSnap.data() will be undefined in this case
      alert("회원정보를 찾을 수 없습니다.");
      navigate("/");
    }
  };

  const GetDocs = async () => {
    ////////// 게시글 불러오기
    const articlesRef = collection(db, "articles");
    // const q = query(articlesRef, where("expiration", "==", false)); // 정렬 없음
    // const q = query(articlesRef, where("expiration", "==", false), orderBy("time")); // 최근 게시글이 최히단에 위치
    const q = query(articlesRef, where("expiration", "==", false), orderBy("time", "desc")); // 최근 게시글이 최상단에 위치
    const newData = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data().expiration);
      newData.push(doc.data());
    });
    setLoadedArticles(() => newData);
  };

  ////////// 게시글 렌더링
  const renderArticles = (arr) => {
    return (
      <>
        {arr.map((item, index) => (
          <>
            <DetailedArticle key={index} articleInfo={item} userInfo={userData}></DetailedArticle>
          </>
        ))}
      </>
    );
  };

  ////////// 사용자 정보 입력 여부
  const isEnterUserInfo = async (userData) => {
    if (userData.name && userData.major && userData.gender && userData.age && userData.number) {
      console.log("사용자 정보가 모두 입력되어 있습니다.");
    } else {
      console.log("사용자 정보가 모두 입력되지 않았습니다.\n사용자 정보 >>\n", userData);
      alert("사용자 정보를 모두 입력해 주세요.");
      navigate("/MyInfo", {
        state: { uid: userUid },
      });
    }
  };

  ////////// 마운트
  useEffect(() => {
    const fetchData = async () => {
      await readUserInfo();
      GetDocs();
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <Header />
      <Container>
        {/* 카테고리 */}
        <CategoryItemGroup>
          <CategoryItem
            label="밥팅"
            src={categoryImg1}
            isSelect={categoryState.babting}
            onClickFunc={changeCategory}
            onClickFuncParameter="babting"
          />
          <CategoryItem
            label="스터팅"
            src={categoryImg2}
            isSelect={categoryState.stuting}
            onClickFunc={changeCategory}
            onClickFuncParameter="stuting"
          />
          <CategoryItem
            label="과팅"
            src={categoryImg3}
            isSelect={categoryState.guating}
            onClickFunc={changeCategory}
            onClickFuncParameter="guating"
          />
        </CategoryItemGroup>
        {/* 게시물 컨테이너 */}
        <ArticleContainer>{renderArticles(loadedArticles)}</ArticleContainer>
        {/* 글쓰기 버튼 */}
        <AddArticle userData={userData} />
      </Container>
    </>
  );
};

// 전체 컨테이너
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Background = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 게시물 컨테이너
const ArticleContainer = styled.div`
  width: 320px;
  height: 550px;
  overflow: auto;
  padding: 0px 10px;
  margin-bottom: 20px;

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

const CategortItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CategortItemImg = styled.img`
  width: 90px;
  height: 90px;
  opacity: ${(props) => (props.isSelect ? "1" : "0.5")};
`;

const CategortItemButton = styled.button`
  background-color: ${(props) => (props.isSelect ? "#72C6EF" : "white")};
  width: 90px;
  height: 30px;
  border-radius: 10px;
  border-width: 3px;
  border-style: solid;
  border-color: ${(props) => (props.isSelect ? "#1C9AD6" : "#72C6EF")};
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.isSelect ? "#111111" : "#767676")};
  font-family: "Pretendard-Regular";
`;

const CategoryItem = ({ label, src, isSelect, onClickFunc, onClickFuncParameter }) => {
  const itemClick = () => {
    onClickFunc(onClickFuncParameter); //changeCategory호출
  };
  return (
    <>
      <CategortItemContainer onClick={itemClick}>
        <CategortItemImg src={src} alt="category" isSelect={isSelect} />
        <CategortItemButton isSelect={isSelect}>{label}</CategortItemButton>
      </CategortItemContainer>
    </>
  );
};

const CategoryItemGroup = styled.div`
  width: 320px;
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
`;

export default Main;
