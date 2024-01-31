import { useNavigate } from "react-router-dom";

export function useCookie() {
  const navigate = useNavigate(); 

  ////////// 쿠키 저장하기
  const setCookie = (name, value, daysToExpire) => {
    //(쿠키 이름, 쿠키에 저장할 값, 쿠키 만료 기간)
    let expirationDate = new Date(); // 쿠키 저장 날짜
    expirationDate.setDate(expirationDate.getDate() + daysToExpire); // 쿠키 저장일에 만료기간 매개변수를 더하여 만료일 설정

    // 쿠키에 저장할 값
    let cookieString =
      name + "=" + encodeURIComponent(value) + "; expires=" + expirationDate.toUTCString() + "; path=/";
    // 쿠키에 저장하기
    document.cookie = cookieString;
  };

  ////////// 쿠키 읽어오기
  const getCookie = (name) => {
    let cookies = document.cookie.split(";"); //document.cookie는 "쿠키1=값1; 쿠키2=값2; 쿠키3=값3" 문자열 형태를 반환한다. split(";")은 해당 문자열을 세미콜론(;)를 기준으로 분리해 배열 형태로 저장한다. 즉, 위 코드는 저장된 쿠키를 문자열 형태로 가져와 세미콜론(;)을 기준으로 분리해 배열로 반환한다.
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim(); // 배열 요소의 공백 제거 cookie의 값은 "쿠키1=값1" 문자열이다.
      if (cookie.indexOf(name + "=") === 0) {
        // 매개변수로 전달된 이름과 현재 순회중인 cookie의  name이 같다면 쿠키 값 반환.
        return decodeURIComponent(cookie.substring(name.length + 1)); //name.length + 1인덱스부터 문자열의 끝까지 자른다. 즉, 쿠키명을 제외하고 쿠키의 값만을 추출해낸다. decodeURIComponent() 함수는 URL 인코딩된 문자열을 디코딩하여 원래의 문자열로 변환하는 함수입니다.
      }
    }
    navigate("/"); // 쿠키가 없을 경우 로그인 화면으로 이동.
  };

  return { setCookie, getCookie };
}
