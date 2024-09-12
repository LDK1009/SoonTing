# 순팅

<a href="https://www.soonting.site/" target="_blank">
<img src="https://github.com/LDK1009/CapstoneDesign/assets/86905679/19db0ef8-5a1c-4143-bfcb-b45d3dea8a2b" alt="배너" width="100%"/>
</a>

<br/>
<br/>

# 0. Getting Started (시작하기)
```bash
$ npm start
```
[서비스 링크](https://www.soonting.site/)

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
- 프로젝트 이름: 순팅
- 프로젝트 설명: ‘순팅’은 순천향대학교 재학생들의 대면 소통 능력 향상 및 커뮤니티 형성을 위해 제작된 대면 만남 매칭 서비스입니다.

<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)
| 이동규 |
|:------:|
| <img src="https://github.com/user-attachments/assets/c1c2b1e3-656d-4712-98ab-a15e91efa2da" alt="이동규" width="150"> |
| FE |
| [GitHub](https://github.com/LDK1009) |

<br/>
<br/>

# 3. Key Features (주요 기능)
- **회원가입**:
  - google OAuth를 통해 회원가입합니다.
  - 회원가입 시 DB에 유저정보가 등록됩니다.

- **로그인**:
  - google OAuth를 통해 로그인합니다.
  - 사용자 인증 정보를 통해 로그인합니다.

- **매칭 신청**:
  - 게시물 상세보기에서 '매칭신청' 버튼을 클릭하면 작성자에게 매칭 신청이 됩니다.

- **매칭 확정**:
  - '매칭 확정'을 통해 매칭 신청자의 상세 정보를 확인할 수 있습니다.

- **내가 쓴 게시물 조회**:
  - 작성한 게시물을 모두 조회합니다.
  - 게시물에 매칭 신청한 매칭 신청자를 확인할 수 있습니다.

- **내가 매칭신청한 게시물**:
  - 매칭신청한 게시물을 모두 조회 및 수정이 가능합니다.

- **내 정보 수정**:
  - 내 정보를 수정할 수 있습니다.

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
|  |  |  |
|-----------------|-----------------|-----------------|
| 이동규    |  <img src="https://github.com/user-attachments/assets/c1c2b1e3-656d-4712-98ab-a15e91efa2da" alt="이동규" width="100"> | <ul><li>프로젝트 계획 및 관리</li><li>컴포넌트 개발</li><li>커스텀훅 개발</li><li>Firebase API 통신</li></ul>     |


<br/>
<br/>

# 5. Technology Stack (기술 스택)
## 5.1 Language
|  |  |
|-----------------|-----------------|
| HTML5    |<img src="https://github.com/user-attachments/assets/2e122e74-a28b-4ce7-aff6-382959216d31" alt="HTML5" width="100">| 
| CSS3    |   <img src="https://github.com/user-attachments/assets/c531b03d-55a3-40bf-9195-9ff8c4688f13" alt="CSS3" width="100">|
| Javascript    |  <img src="https://github.com/user-attachments/assets/4a7d7074-8c71-48b4-8652-7431477669d1" alt="Javascript" width="100"> | 

<br/>

## 5.2 Frotend
|  |  |  |
|-----------------|-----------------|-----------------|
| React    |  <img src="https://github.com/user-attachments/assets/e3b49dbb-981b-4804-acf9-012c854a2fd2" alt="React" width="100"> | 18.2.0    |
| StyledComponents    |  <img src="https://github.com/user-attachments/assets/c9b26078-5d79-40cc-b120-69d9b3882786" alt="StyledComponents" width="100">| 6.1.8   |
| MaterialUI    |  <img src="https://github.com/user-attachments/assets/75a46fa7-ebc0-4a9d-b648-c589f87c4b55" alt="MUI" width="100">    | 5.15.10  |
| DayJs    |  <img src="https://github.com/user-attachments/assets/3632d7d6-8d43-4dd5-ba7a-501a2bc3a3e4" alt="DayJs" width="100">    | 1.11.10    |
| framer-motion    |  <img src="https://github.com/LDK1009/CapstoneDesign/assets/86905679/4ec72a7b-c179-404b-a28b-590b4576f988" width="100"/>    | 10.16.16    |


<br/>

## 5.3 Backend
|  |  |  |
|-----------------|-----------------|-----------------|
| Firebase    |  <img src="https://github.com/user-attachments/assets/1694e458-9bb0-4a0b-8fe6-8efc6e675fa1" alt="Firebase" width="100">    | 10.7.2    |

<br/>

## 5.4 Cooperation
|  |  |
|-----------------|-----------------|
| Git    |  <img src="https://github.com/user-attachments/assets/483abc38-ed4d-487c-b43a-3963b33430e6" alt="git" width="100">    |


<br/>

# 6. Project Structure (프로젝트 구조)
```plaintext
project/
├── public/
│   ├── index.html           # HTML 템플릿 파일
│   └── favicon.ico          # 아이콘 파일
├── src/
│   ├── assets/              # 이미지, 폰트 등 정적 파일
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── hooks/               # 커스텀 훅 모음
│   ├── pages/               # 각 페이지별 컴포넌트
│   ├── App.js               # 메인 애플리케이션 컴포넌트
│   ├── index.js             # 엔트리 포인트 파일
│   ├── index.css            # 전역 css 파일
│   ├── firebaseConfig.js    # firebase 인스턴스 초기화 파일
│   package-lock.json        # 정확한 종속성 버전이 기록된 파일로, 일관된 빌드를 보장
│   package.json             # 프로젝트 종속성 및 스크립트 정의
├── .gitignore               # Git 무시 파일 목록
└── README.md                # 프로젝트 개요 및 사용법
```

<br/>
<br/>

# 7 미리보기
![image](https://github.com/LDK1009/CapstoneDesign/assets/86905679/16295603-b90a-4f06-bc3b-59e6f324fb26)
![image](https://github.com/user-attachments/assets/c1ce9dc2-a36f-426b-bc2e-7887ba1392e6)
![image](https://github.com/user-attachments/assets/82b1e55a-31d0-47e7-b94e-53917e5ca6a9)
![image](https://github.com/LDK1009/CapstoneDesign/assets/86905679/f77c2774-02a5-48e9-acb3-df16f5c41195)
![image](https://github.com/LDK1009/CapstoneDesign/assets/86905679/40eee04f-e779-491c-9e57-2896809ce52a)
![image](https://github.com/LDK1009/CapstoneDesign/assets/86905679/392b6058-5d0e-448a-aa5b-d8ea5e1a180a)
![image](https://github.com/LDK1009/CapstoneDesign/assets/86905679/7aa7e0af-f02c-4a3a-8d3e-43e0c8893e25)
![image](https://github.com/LDK1009/CapstoneDesign/assets/86905679/3924df1b-b986-439b-824d-983724e4512d)
