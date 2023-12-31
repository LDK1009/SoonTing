import React, { useEffect } from "react";
import { auth, db, provider } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import styled from "styled-components";
import google from "../assets/google.png";

const SignIn = () => {
  const navigate = useNavigate(); // 네비게이트 변수

  ////////// 구글 로그인
  const GoogleSignIn = () => {
    signInWithPopup(auth, provider) // 로그인 팝업을 띄운다.
      .then((result) => {
        //로그인 성공 시
        // const credential = GoogleAuthProvider.credentialFromResult(result); // 모름
        // const token = credential.accessToken; // 토큰을 받는다.
        const user = result.user; // 유저 데이터
        // console.log("유저 데이터!!!" + JSON.stringify(user, null, 2));
        setCookie("uid", user.uid, 7); // 쿠키 저장(7일) // uid라는 이름으로 유저의 uid를 쿠키에 7일 동안 저장한다.
        isUserSignUp(user); // 회원가입 여부 판단
      })
      .catch((error) => {
        console.log(
          "\nerrorCode : " +
            error.code +
            "\nerrorMessage : " +
            error.message +
            "\nemail : " +
            error.email + // 수정된 부분
            "\ncredential : " +
            GoogleAuthProvider.credentialFromError(error)
        );
      });
  };

  ////////// 회원가입 여부
  const isUserSignUp = async (userData) => {
    const docRef = doc(db, "users", userData.uid); // DB의 users 컬렉션에서 문서명이 유저의 uid인 문서를 참조한다.
    const docSnap = await getDoc(docRef); // 참조한 문서를 가져온다

    // 기존 유저의 경우(문서명이 유저의 uid인 문서가 존재할 경우)
    if (docSnap.exists()) {
      // Main 페이지로 로드하면서 uid를 네비게이트 프롭스로 전달한다.
      // console.log("유저 아이디" + userData.uid);
      navigate("/Main", {
        state: { uid: userData.uid },
      });
    }
    // 신규 유저의 경우(문서명이 유저의 uid인 문서가 존재하지 않을 경우)
    else {
      // users 컬렉션에 uid 이름의 문서를 생성하고 유저의 정보를 저장한다.
      await setDoc(doc(db, "users", userData.uid), {
        uid: userData.uid,
        name: userData.displayName,
        email: userData.email,
      });
      // 유저 정보 저장을 마친 후 Main 페이지로 로드하면서 uid를 네비게이트 프롭스로 전달한다.
      navigate("/Main", {
        state: { uid: userData.uid },
      });
    }
  };

  ////////// 쿠키 저장
  const setCookie = (name, value, daysToExpire) => {
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);

    let cookieString =
      name + "=" + encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
    document.cookie = cookieString;
  };

  ////////// 쿠키 읽어오기
  const getCookie = (name) => {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(name + "=") === 0) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  };

  // ////////// 쿠키 삭제하기
  // function deleteCookie(name) {
  //   document.cookie = encodeURIComponent(name) + "=; expires=Thu, 01 JAN 1999 00:00:10 GMT";
  // }

  ////////// 쿠키 보유 여부
  const isHaveCookie = () => {
    // 쿠키에 저장된 uid를 가져온다
    const userUid = getCookie("uid");
    // 쿠기에 저장된 uid가 있다면 Main 페이지로 로드하면서 uid를 네비게이트 프롭스로 전달한다.
    if (userUid) {
      navigate("/Main", {
        state: { uid: userUid },
      });
    }
  };

  ////////// 마운트
  useEffect(() => {
    isHaveCookie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // var target_url = "https://ldk1009.github.io/CapstoneDesign/";
  // window.location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(target_url);

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <Background>
        <Container>
          <MainText>순천향대 학우들과 함께하는 새로운 이야기의 시작!</MainText>
          <LoginButton onClick={() => GoogleSignIn()}>
            <GoogleImg src={google} alt="google" />
            구글로 로그인 하기
          </LoginButton>
        </Container>
      </Background>
    </>
  );
};

const Background = styled.div`
  height: 100%;
  background-image: url("./background.jpg");
  background-repeat: no-repeat; /* 배경 이미지 반복 설정 */
  background-size: cover; /* 배경 이미지 크기 조절 (cover, contain 등) */
  background-position: center; /* 배경 이미지 위치 조절 */
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginButton = styled.div`
  background-color: white;
  border-radius: 20px;
  font-size: 20px;
  width: 80%;
  height: 50px;
  font-family: "omyu_pretty";
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const MainText = styled.div`
  width: 80%;
  margin-bottom: 30px;
  font-size: 30px;
  color: white;
  text-align: center;
  text-shadow: -1px -1px 15px pink, 1px -1px 15px pink, -1px 1px 15px pink, 1px 1px 15px pink;
`;

const GoogleImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

export default SignIn;
