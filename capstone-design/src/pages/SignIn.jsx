import React, { useEffect, useState } from "react";
import { auth, db, provider } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import styled from "styled-components";
import google from "../assets/google.png";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import ScrollIcon from "../components/ScrollIcon";
import coreValueItemImg1 from "../assets/만남.png";
import coreValueItemImg2 from "../assets/소통.png";
import coreValueItemImg3 from "../assets/협력.png";

const SignIn = () => {
  const navigate = useNavigate(); // 네비게이트 변수
  const slideText = [
    "이번 주 토요일에 새로운 카페 탐방 갈 사람?! 낼 오후에 같이 쇼핑 갈 사람 구한다?! 담주 일욜에 같이 요가 수업 들을 사람?! 이번 주 금욜에 스파에서 마사지 받을 사람?! 낼 저녁에 같이 요리 대결할 사람?! 담주 토욜에 새로 개장한 영화관 갈 사람?! 이번 주 일욜에 새로운 레스토랑에서 점심 먹을 사람?! 낼 오후에 동네 공원에서 피크닉 할 사람?! 담주 목욜에 새로운 공연 보러 갈 사람?! 이번 주 토욜에 같이 스케이트 보드 타러 갈 사람?! ",
    "낼 저녁에 요가 수업 같이 들을 사람?! 담주 일욜에 동네 카페에서 새로운 메뉴 시식할 사람?! 이번 주 금욜에 열리는 축제 같이 갈 사람?! 낼 오후에 새로 개장한 공원에서 산책할 사람?! 담주 수욜에 새로운 카페에서 커피 한잔 할 사람?! 이번 주 토욜에 전시회 같이 갈 사람?! 낼 저녁에 새로운 레스토랑에서 저녁 같이 먹을 사람?! 담주 일욜에 오픈 마이크 이벤트 같이 갈 사람?! 이번 주 금욜에 새로 개장한 헬스장 같이 갈 사람?! 낼 오후에 다양한 음식 같이 먹을 사람?! 이번 주말에 놀이공원 같이 갈 사람?! 내일 점심에 브런치 같이 먹을 사람?! 다음 주에 같이 여행 갈 사람?! 이번 주에 같이 영화 보러 갈 사람?! 내일 저녁에 같이 술 한잔 할 사람?! 다음 주에 같이 등산 갈 사람?! 이번 주말에 같이 캠핑 갈 사람?! 내일 점심에 같이 카페 갈 사람?! 다음 주에 같이 미술관 갈 사람?! 이번 주에 같이 콘서트 갈 사람?! 이번 주말에 같이 바다 보러 갈 사람?! 내일 점심에 같이 초밥 먹으러 갈 사람?! 다음 주에 같이 미술관 갈 사람?! 이번 주에 같이 영화 보러 갈 사람?! 내일 저녁에 같이 술 한잔 할 사람?! 다음 주에 같이 캠핑 갈 사람?! 이번 주말에 같이 놀이공원 갈 사람?! 내일 점심에 같이 브런치 먹으러 갈 사람?! 다음 주에 같이 여행 갈 사람?! 이번 주에 같이 콘서트 갈 사람?! 이번 주말에 같이 드라이브 갈 사람?! 내일 점심에 같이 파스타 먹으러 갈 사람?! 다음 주에 같이 동물원 갈 사람?! 이번 주에 같이 뮤지컬 보러 갈 사람?! 내일 저녁에 같이 고기 먹으러 갈 사람?! 다음 주에 같이 수영장 갈 사람?! 이번 주말에 같이 자전거 타러 갈 사람?! 내일 점심에 같이 샐러드 먹으러 갈 사람?! 다음 주에 같이 박물관 갈 사람?! 이번 주에 같이 연극 보러 갈 사람?! 이번 주말에 같이 등산 갈 사람?! 내일 점심에 같이 떡볶이 먹으러 갈 사람?! 다음 주에 같이 스케이트장 갈 사람?! 이번 주에 같이 전시회 갈 사람?! 내일 저녁에 같이 치맥 먹으러 갈 사람?! 다음 주에 같이 놀이공원 갈 사람?! 이번 주말에 같이 낚시 갈 사람?! 내일 점심에 같이 샌드위치 먹으러 갈 사람?! 다음 주에 같이 워터파크 갈 사람?! 이번 주에 같이 음악회 갈 사람?! 이번 주말에 같이 캠핑 갈 사람?! 내일 점심에 같이 마라탕 먹으러 갈 사람?! 다음 주에 같이 스키장 갈 사람?! 이번 주에 같이 재즈바 갈 사람?! 내일 저녁에 같이 회 먹으러 갈 사람?! 다음 주에 같이 아이스링크장 갈 사람?! 이번 주말에 서핑하러 갈 사람?! 내일 점심에 같이 라멘 먹으러 갈 사람?! 다음 주에 같이 VR체험관 갈 사람?! 이번 주에 같이 뮤지컬 보러 갈 사람?! 이번 주말에 같이 자전거 타러 갈 사람?! 내일 점심에 같이 돈까스 먹으러 갈 사람?! 다음 주에 같이 볼링 치러 갈 사람?! 이번 주에 같이 도서관 갈 사람?! 내일 저녁에 같이 피자 먹으러 갈 사람?!",
  ];

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
        <SlideTextContainer>
          <MotionSlideText direction={false} text={slideText[0]}></MotionSlideText>
          <MotionSlideText direction={true} text={slideText[0]}></MotionSlideText>
          <MotionSlideText direction={false} text={slideText[1]}></MotionSlideText>
        </SlideTextContainer>
        {/* 규모 */}
        <PromotionLabel>규모</PromotionLabel>
        <MotionScaleContainer>
          <MotionScale label="사용자" endNum={1689} unit="명" />
          <MotionScale label="매칭" endNum={2946} unit="건" />
        </MotionScaleContainer>
        {/* 핵심가치 */}
        <PromotionLabel>핵심가치</PromotionLabel>
        <CoreValueContainer>
          <CoreValueItem label="만남" src={coreValueItemImg1} />
          <CoreValueItem label="소통" src={coreValueItemImg2} />
          <CoreValueItem label="협력" src={coreValueItemImg3} />
        </CoreValueContainer>
        {/* 슬롯 텍스트 */}
        <SlotTextContainer>
          <SlotTextWrap>
            <SlotText>순팅은&nbsp;</SlotText>
            <SlotTextMotion />
          </SlotTextWrap>
          <SlotText>학생들을 기다리고 있습니다.</SlotText>
        </SlotTextContainer>
        
      </Container>
    </>
  );
};

// 전체 컨테이너
const Container = styled.div`
  background-color: #26539c;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 350px;
`;

// 로그인 버튼
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

// 대제목 텍스트
export const MainTitleText = styled(motion.div)`
  color: ${(props) => props.color || "white"};
  font-size: 30px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: -2.5%;
  text-align: center;
`;

// 부제목 텍스트
export const SubTitleText = styled(MainTitleText)`
  font-size: 22px;
  line-height: 32px;
`;

// 강조 텍스트
export const EmphasisText = styled(MainTitleText)`
  font-size: 18px;
  line-height: 28px;
`;

// 본문 텍스트
export const BodyText = styled(MainTitleText)`
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
`;

// 본문 흐림 텍스트
export const BodyBlurText = styled(BodyText)`
  color: #767676;
`;

// 로그인 버튼 내부 아이콘
const GoogleImg = styled.img`
  width: 30px;
  height: 30px;
`;

// 홍보 컨테이너 라벨
const PromotionLabel = styled(SubTitleText)`
  margin-bottom: 5px;
  margin-left: 10px;
  width: 100%;
  text-align: left;
  margin-top: 30px;
`;

// 홍보 컨테이너
const PromotionContainer = styled.div`
  background-color: #4d207a;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// 슬라이드 텍스트 컨테이너
const SlideTextContainer = styled(PromotionContainer)`
  overflow-x: hidden;
  margin-top: 30px;
`;

// 슬라이드 텍스트
const SlideText = styled(EmphasisText)`
  white-space: nowrap;
`;

// 슬라이드 텍스트 모션 컴포넌트
const MotionSlideText = ({ direction, text }) => {
  const start = direction ? -2000 : 0;
  const end = direction ? 0 : -2000;
  return (
    <>
      <motion.div initial={{ x: start }} animate={{ x: end }} transition={{ duration: 180 }}>
        <SlideText>{text}</SlideText>
      </motion.div>
    </>
  );
};

// 사용자,매칭 수 컨테이너
const MotionScaleContainer = styled(PromotionContainer)`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

// 모션 스케일 아이템 묶음
const MotionScaleWrap = styled.div``;

// 사용자, 매칭 텍스트
const MotionScaleLabel = styled(EmphasisText)`
  text-align: start;
`;

// 숫자, 단위 묶음
const MotionScaleWrap2 = styled.div`
  display: flex;
  align-items: end;
`;

// 숫자
const MotionScaleQuantity = styled(MainTitleText)`
  margin: 5px 5px 0px 0px;
`;

// 단위
const MotionScaleUnit = styled(EmphasisText)``;

// 모션 스케일 컴포넌트
const MotionScale = ({ label, endNum, unit }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, endNum, { duration: 1.5 });

    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MotionScaleWrap>
        <MotionScaleLabel>{label}</MotionScaleLabel>
        <MotionScaleWrap2>
          <MotionScaleQuantity>
            <motion.div>{rounded}</motion.div>
          </MotionScaleQuantity>
          <MotionScaleUnit>{unit}</MotionScaleUnit>
        </MotionScaleWrap2>
      </MotionScaleWrap>
    </>
  );
};

const CoreValueContainer = styled(PromotionContainer)`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const CoreValueItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; //수평
  justify-content: center; //수직
`;
const CoreValueItemLabel = styled(EmphasisText)`
  margin-bottom: 10px;
`;

const CoreValueItemImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background-color: white;
`;
const CoreValueItem = ({ label, src }) => {
  return (
    <>
      <CoreValueItemContainer>
        <CoreValueItemLabel>{label}</CoreValueItemLabel>
        <CoreValueItemImg alt="CoreValue" src={src} />
      </CoreValueItemContainer>
    </>
  );
};

const SlotTextContainer = styled(PromotionContainer)`
  margin-top: 30px;
`;

const SlotTextWrap = styled.div`
  display: flex;
`;

const SlotText = styled(SubTitleText)`
  text-align: left;
`;

// 슬롯텍스트 모션 컴포넌트
const SlotTextMotion = () => {
  // 슬롯에 표시될 문자열을 담은 배열
  const arr = [
    "컴퓨터소프트웨어공학과",
    "전기공학과",
    "간호학과",
    "기계공학과",
    "의료생명공학과",
    "보건행정경영학과",
    "에너지환경공학과",
    "생명과학과",
    "경찰행정학과",
  ];

  // 현재 보여지고 있는 슬롯의 인덱스를 나타내는 상태 변수
  const [currentIndex, setCurrentIndex] = useState(0);

  // 애니메이션이 완료되면  호출되는 함수
  const onAnimationComplete = () => {
    // 다음 슬롯으로 이동하기 위해 currentIndex 업데이트
    setCurrentIndex((prev) => (prev + 1) % arr.length);
  };

  // Framer motion 애니메이션에 필요한 속성값 객체
  const slotVariants = {
    // initial: { opacity: 1, y: 40,  }, // 텍스트는 밑에서 시작해서
    // initial: { rotateX: -90, y: 20, opacity:0.3 }, // 텍스트는 밑에서 시작해서
    // animate: { opacity: 0.7, y: -40 }, // 위로 올라온다
    animate: { rotateX: [-90, 90], y: [20,-20], opacity:[0.3, 1, 0.3] }, // 위로 올라온다
    transition: { duration: 2, ease: "linear", times: [0, 0.5, 1] }, // initial 상태에서 animate 상태까지 도달하는 데에 걸리는 시간은 duration
  };

  return (
    <>
      {/* 애니메이션의 등장,퇴장 감지 / onAnimationComplete을 사용하려면 필요함 */}
      <AnimatePresence>
        {/* 애니메이션 박스 */}
        <motion.div
          key={currentIndex} // 현재 슬롯의 인덱스를 키로 사용하여 애니메이션 처리
          variants={slotVariants}
          initial={slotVariants.initial}
          animate={slotVariants.animate}
          transition={slotVariants.transition}
          // 애니메이션이 완료될 때 호출되는 함수 지정
          onAnimationComplete={onAnimationComplete}
          >
          {/* 슬롯 아이템 보이는 곳 */}
          <SlotText style={{ color: "#72C6EF"}}>{arr[currentIndex]}</SlotText>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SignIn;
