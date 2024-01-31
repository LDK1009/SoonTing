import * as React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import AddArticle from "../components/AddArticle";
import DetailedArticle from "../components/DetailedArticle";
import styled from "styled-components";
import Header from "../components/Header";
import categoryImg1 from "../assets/순팅.png";
import categoryImg2 from "../assets/번개팅.png";
import categoryImg3 from "../assets/과팅.png";
import { useEffect, useState } from "react";
import { useCookie } from "../hooks/useCookie";

//Vercel환경변수 적용 커밋
const Main = () => {
  //커스텀훅 가져오기
  const { getCookie } = useCookie();
  // 쿠키에서 uid 가져오기
  const uid = getCookie("uid");
  // 네비게이트 변수
  const navigate = useNavigate();
  // 밥팅 게시물
  const [babtingArticles, setBabtingArticles] = useState([]);
  // 스터팅 게시물
  const [stutingArticles, setStutingArticles] = useState([]); // 스터팅 게시글
  // 과팅 게시물
  const [gwatingArticles, setGwatingArticles] = useState([]); // 과팅 게시글
  // 현재 게시물(렌더링할 게시물)
  const [currentArticles, setCurrentArticles] = useState([]); // 카테고리 변경에 따라 현재 보여줄 게시물
  // 카테고리 상태
  const [categoryState, setCategoryState] = useState({
    babting: true,
    stuting: false,
    gwating: false,
  });
  ////////// 유저 정보
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
    // users컬렉션에 uid인 문서가 있는지 확인하고 있다면 해당 유저 정보를 가져오기
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    // uid인 문서가 있을 경우
    if (docSnap.exists()) {
      const userDataFromDb = docSnap.data(); //DB에서 가져온 유저 정보
      setUserData(userDataFromDb); //유저 정보 저
      // 데이터 업데이트 후에 isEnterUserInfo 함수 호출
      isEnterUserInfo(userDataFromDb);
    } else {
      // docSnap.data() will be undefined in this case
      alert("회원정보를 찾을 수 없습니다.");
      navigate("/");
    }
  };

  ////////// 사용자 정보 입력 여부
  const isEnterUserInfo = async (userData) => {
    if (userData.name && userData.major && userData.gender && userData.age && userData.number) {
      console.log("사용자 정보가 모두 입력되어 있습니다.");
    } else {
      console.log("사용자 정보가 모두 입력되지 않았습니다.\n사용자 정보 >>\n", userData);
      alert("사용자 정보를 모두 입력해 주세요.");
      navigate("/MyInfo");
    }
  };

  ////////// 게시물 가져오기
  const GetDocs = async (category) => {
    ////////// 게시글 불러오기
    const articlesRef = collection(db, "articles");
    // const q = query(articlesRef, where("expiration", "==", false)); // 정렬 없음
    // const q = query(articlesRef, where("expiration", "==", false), orderBy("time")); // 최근 게시글이 최히단에 위치
    const q = query(
      articlesRef,
      where("expiration", "==", false),
      where("category", "==", category),
      orderBy("time", "desc")
    ); // 최근 게시글이 최상단에 위치
    const newData = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data().expiration);
      newData.push(doc.data());
    });
    switch (category) {
      case "밥팅":
        setBabtingArticles(() => newData);
        break;
      case "스터팅":
        setStutingArticles(() => newData);
        break;
      case "과팅":
        setGwatingArticles(() => newData);
        break;
      default:
        break;
    }
  };

  ////////// 카테고리 변경
  const changeCategory = (category) => {
    switch (category) {
      case "babting":
        setCategoryState({
          babting: true,
          stuting: false,
          gwating: false,
        });
        console.log("카테고리클릭!");
        break;
      case "stuting":
        setCategoryState({
          babting: false,
          stuting: true,
          gwating: false,
        });
        console.log("카테고리클릭!");
        break;
      case "gwating":
        setCategoryState({
          babting: false,
          stuting: false,
          gwating: true,
        });
        console.log("카테고리클릭!");
        break;
      default:
        console.log("카테고리클릭! 하지만 아무일도 없었다");
        break;
    }
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

  ////////// 마운트
  useEffect(() => {
    readUserInfo();
    GetDocs("밥팅");
    GetDocs("스터팅");
    GetDocs("과팅");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////// 밥팅,스터팅,과팅 게시물 모두 로드 후 & 카테고리 변경시 렌더링할(현재) 게시물 변경
  useEffect(() => {
    if (categoryState.babting) {
      setCurrentArticles(babtingArticles);
    } else if (categoryState.stuting) {
      setCurrentArticles(stutingArticles);
    } else if (categoryState.gwating) {
      setCurrentArticles(gwatingArticles);
    } else {
      console.log("카테고리 선택 오류");
    }
  }, [babtingArticles, stutingArticles, gwatingArticles, categoryState]);

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
            label="순팅"
            src={categoryImg1}
            isSelect={categoryState.babting}
            propsFunc={changeCategory}
            propsFuncParam="babting"
          />
          <CategoryItem
            label="번개팅"
            src={categoryImg2}
            isSelect={categoryState.stuting}
            propsFunc={changeCategory}
            propsFuncParam="stuting"
          />
          <CategoryItem
            label="과팅"
            src={categoryImg3}
            isSelect={categoryState.gwating}
            propsFunc={changeCategory}
            propsFuncParam="gwating"
          />
        </CategoryItemGroup>
        {/* 게시물 컨테이너 */}
        <ArticleContainer>{renderArticles(currentArticles)}</ArticleContainer>
        {/* 글쓰기 버튼 */}
        <AddArticle userData={userData} />
      </Container>
    </>
  );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////컴포넌트//////////////////////////////////////////////////

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
export const ArticleContainer = styled.div`
  width: 330px;
  height: 570px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const CategortItemButton = styled.button`
  background-color: white;
  width: 90px;
  height: 30px;
  border-radius: 10px;
  border-width: 2px;
  border-style: solid;
  border-color: #739ff0;
  color: ${(props) => (props.isSelect ? "#26539C" : "#767676")};
  font-size: 14px;
  font-weight: 600;
  opacity: ${(props) => (props.isSelect ? "1" : "0.6")};
  font-family: "Pretendard-Regular";
`;

const CategoryItem = ({ label, src, isSelect, propsFunc, propsFuncParam }) => {
  const itemClick = () => {
    propsFunc(propsFuncParam); //changeCategory호출
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
