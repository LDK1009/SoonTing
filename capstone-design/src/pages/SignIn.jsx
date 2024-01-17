import React, { useEffect } from "react";
import { auth, db, provider } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import styled from "styled-components";
import google from "../assets/google.png";
import { motion } from "framer-motion";
import ScrollIcon from "../components/ScrollIcon";

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
    // 쿠키에 저장된 uid가 있다면 Main 페이지로 로드하면서 uid를 네비게이트 프롭스로 전달한다.
    if (userUid) {
      navigate("/Main", {
        state: { uid: userUid },
      });
    }
  };

  ////////// 마운트
  useEffect(() => {
    isHaveCookie(); // 쿠키 보유 여부 확인
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <Container>
        {/* 메인 텍스트 */}
        <MainTitleText initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          순천향대 학우들과 함께하는
          <br />
          새로운 이야기의 시작!
        </MainTitleText>
        {/* 로그인 버튼 */}
        <LoginButton onClick={() => GoogleSignIn()}>
          <GoogleImg src={google} alt="google" />
          <BodyText color="black">구글로 로그인 하기</BodyText>
        </LoginButton>
        {/* 스크롤 아이콘 */}
        <ScrollIcon />
        {/* 슬라이드 텍스트 */}
        <PromotionLabel>슬라이드 텍스트</PromotionLabel>
        <PromotionContainer>
          
        </PromotionContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  background-color: #26539c;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 350px;
`;

const LoginButton = styled.div`
  width: 200px;
  height: 50px;
  background-color: white;
  border-radius: 5px;
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

export const MainTitleText = styled(motion.div)`
  color: ${(props) => props.color || "white"};
  font-size: 30px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: -2.5%;
  text-align: center;
`;

export const SubTitleText = styled(MainTitleText)`
  font-size: 22px;
  line-height: 32px;
`;

export const EmphasisText = styled(MainTitleText)`
  font-size: 18px;
  line-height: 28px;
`;

export const BodyText = styled(MainTitleText)`
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
`;

export const BodyBlurText = styled(BodyText)`
  color: #767676;
`;

const GoogleImg = styled.img`
  width: 30px;
  height: 30px;
`;
const PromotionLabel = styled(SubTitleText)`
  margin-bottom:5px;
  margin-left:10px;
  width:100%;
  text-align:left;
`
const PromotionContainer = styled.div`
  background-color:#4D207A;
  width:100%;
  height:150px;
  display:flex;
  flex-direction:column;
  justify-content:center;
`

export default SignIn;
