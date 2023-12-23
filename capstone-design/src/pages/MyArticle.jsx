import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";

const MyArticle = () => {
  const location = useLocation(); // useNavigate 프롭스 전달 받기
  const Uid = location.state.uid; // 네비게이트로 전달 받은 uid
  const [expiredArticles, setExpiredArticles] = useState([]); // 만료된 게시물(1차원 배열)
  const [unExpiredArticles, setUnExpiredArticles] = useState([]); // 만료되지 않은 게시물(1차원 배열)
  const [allApplication, setAllApplication] = useState([[], []]); // 모든 게시물의 모든 신청자 정보(2차원 배열)

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
  const getApplicationHistory = async (articleTitle) => {
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

  ////////// 전체 신청내역 불러오기
  const getAllApplocation = async (articles) => {
    // 매개변수(모든 게시글)의 모든 신청자 정보를 2차원 배열 형태로 받아와 allApplication 상태 변수에 갱신한다. 예) 첫번째 게시글의 신청 내역은 [0][0], [0][1], ... 두번째 게시글의 신청 내역은 [1][0], [1][1], ...
    const arrayLength = articles.length; // 게시글 개수
    const newData = []; // 해당 게시글의 신청 내역을 담을 변수
    for (let i = 0; i < arrayLength; i++) {
      // 게시글 개수 만큼 반복
      const collectionName = articles[i].uid + "_" + articles[i].time; // 게시글 컬렉션명
      const buffer = await getApplicationHistory(collectionName); // 해당 게시글의 모든 신청 내역을 변수에 대입.
      newData.push(buffer); //
    }
    setAllApplication(newData); // allApplication 상태 변수 갱신
  };

  ////////// 게시글&신청내역 렌더링
  const renderExpiredArticles = (articles, allApplication) => {
    // 모든 게시글 배열과 모든 게시물의 모든 신청자 정보 2차원 배열을 받아 게시물1-게시물1의 신청내역들 / 게시물2-게시물2의 신청내역들 을 번갈아 렌더링한다.
    return (
      <>
        {articles.map((item, index) => {
          // 모든 게시물 배열을 순회하며 렌더링 for문 생각하면 편함
          const collectionName = item.uid + "_" + item.time; // 게시물의 문서명 || 컬렉션명
          const aplicationOfArticle = allApplication[index] || []; // 해당 게시물의 모든 신청자 정보를 변수에 대입

          return (
            <div key={index} style={{ border: "3px solid black" }}>
              <div>컬렉션 명 : {collectionName}</div>
              <div>작성시간 : {item.time}</div>
              <div>제목 : {item.title}</div>
              <div>내용 : {item.content}</div>
              <hr />
              {aplicationOfArticle.map((item2, index2) => {
                // 해당 게시물의 모든 신청자 정보를 순회하며 렌더링
                return (
                  <div key={index2} style={{ marginLeft: "20px" }}>
                    {index2 + 1}번째 신청자 : {item2.uid}
                  </div>
                );
              })}
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
    getAllApplocation(unExpiredArticles); // 모든 게시물의 신청자 데이터를 갱신한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unExpiredArticles]);

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <div>
      <div>내가 쓴 글</div>
      <div>{Uid}</div>

      <h1>만료되지 않은 게시물</h1>
      {renderExpiredArticles(unExpiredArticles, allApplication)}
      <h1>만료된 게시물</h1>
      {renderExpiredArticles(expiredArticles)}
    </div>
  );
};

export default MyArticle;
