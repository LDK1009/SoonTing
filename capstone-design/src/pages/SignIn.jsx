import React, { useEffect } from "react";
import { auth, db, provider } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

const SignIn = () => {
  const navigate = useNavigate(); // 네비게이트 변수

  ////////// 구글 로그인
  const GoogleSignIn = () => {
    signInWithPopup(auth, provider) // 로그인 팝업을 띄운다.
      .then((result) => { //로그인 성공 시
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
        uid:userData.uid,
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
      name +
      "=" +
      encodeURIComponent(value) +
      "; expires=" +
      expirationDate.toUTCString() +
      "; path=/";
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

  ////////// 쿠키 보유 여부
  const isHaveCookie = () => {
    // 쿠키에 저장된 uid를 가져온다
    const userUid = getCookie("uid");
    // 쿠기에 저장된 uid가 있다면 Main 페이지로 로드하면서 uid를 네비게이트 프롭스로 전달한다.
    if(userUid){
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

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <div>
      {/* {userData && userData.uid} */}
      <button onClick={() => GoogleSignIn()}>로그인</button>
      {/* <div>{readData && readData.name}</div> */}
    </div>
  );
};

export default SignIn;
