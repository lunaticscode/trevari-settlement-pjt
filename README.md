## 제목: `모두의정산`
> ## 간략 소개  
사적인 모임 혹은 사내회식 때 발생하는 비용을 인원, 모임차수에 맞춰 정산해주고, 정산결과를 상대방에게 공유할 수 있는 어플리케이션.
(웹 어플리케이션)

### 서비스 링크  
http://13.209.91.209/  

### 개발 기간 및 작업 기여도
- 2020.09.12 ~ 2020.10.26 
- Front / Back 100% (개인작)


##    
> ## 개발 환경

#### Cloud
 - AWS - EC2

#### Web Server
 - Nginx ( Proxy )

#### Front (port 9500)
 - HTML, CSS ( SCSS ), Javascript ( ES6 )
 - React.js
 - Redux
 
#### Back (port 9501)
 - Python, Django ( REST-API )

#### DB (port 3306)
 - MySQL

#### 오픈 API 사용현황
 - Iamport API ( 계좌 실명인증 )
 - Kakao Link ( 카카오톡 공유 )

> 외 나머지 다양한 애니메이션 효과(슬라이드, 페이지 전환효과 등)은 라이브러리 없이 직접 구현.

> 비밀번호 저장 방식(Node.js 모듈 Crypto 이용): 개인정보보호법, 정보통신망법에 따른 해시암호(단방향) 저장.

> 개인 정산계좌 저장(Node.js 모듈 Crypto 이용): 정보통신망법에 따른 블록암호화( 대칭키, AES 알고리즘을 통한 CBC방법 ) 저장.





![11](https://user-images.githubusercontent.com/42178661/99777620-efc7df00-2b55-11eb-9de6-1c6e3c76668f.PNG)
![12](https://user-images.githubusercontent.com/42178661/99777658-fa827400-2b55-11eb-8194-d0664db2a58f.PNG)
![13](https://user-images.githubusercontent.com/42178661/99777672-ff472800-2b55-11eb-8efe-1e60752eef20.PNG)




![21](https://user-images.githubusercontent.com/42178661/99777688-0706cc80-2b56-11eb-936e-941411f7e476.PNG)
![22](https://user-images.githubusercontent.com/42178661/99777691-0837f980-2b56-11eb-8a2d-bbd724380c0e.PNG)
![23](https://user-images.githubusercontent.com/42178661/99777696-0a9a5380-2b56-11eb-9906-f98a8762a38f.PNG)
![24](https://user-images.githubusercontent.com/42178661/99777701-0c641700-2b56-11eb-8e76-1818e01b69f0.PNG)
![25](https://user-images.githubusercontent.com/42178661/99777702-0cfcad80-2b56-11eb-8024-d01b50b03988.PNG)


![31](https://user-images.githubusercontent.com/42178661/99908141-3703ca80-2d24-11eb-967f-9a9351c46b79.PNG)
![32](https://user-images.githubusercontent.com/42178661/99908142-3834f780-2d24-11eb-9999-74ac7a61e02d.PNG)
![33](https://user-images.githubusercontent.com/42178661/99908143-38cd8e00-2d24-11eb-9515-34a810630dfb.PNG)
![34](https://user-images.githubusercontent.com/42178661/99908145-3a975180-2d24-11eb-9ff0-9c277e5e4002.PNG)
![35](https://user-images.githubusercontent.com/42178661/99908146-3b2fe800-2d24-11eb-8e75-68960d4bd64b.PNG)


##

     
## 
> ## 서비스 주요기능

### **#0** 메인(홈)
 
 ![모두의정산_홈화면](https://user-images.githubusercontent.com/42178661/97228837-cea3f500-181a-11eb-8665-a786ed1f4fdf.gif)
 ![모두의정산_홈화면(회원전용)](https://user-images.githubusercontent.com/42178661/97229041-19257180-181b-11eb-96ff-c942580a443d.gif)
 ![모두의정산_페이지스택](https://user-images.githubusercontent.com/42178661/97298113-51b66100-1896-11eb-9869-56c6d3758de1.gif)
 
 * 로그인: Django에서 JWT(JSON Web Token) 발행 후, 성공 시 Front에서 Cookie로 저장(회원 관련 주요기능 사용 때 마다 유효성 검사 진행)  
 * 앱 화면 좌우 스와이프 효과: App.js 에서 일어난 터치이벤트를 Redux를 통해 PageStack.js로 전달, 스와이프 방향(actions)에 따른 Routing으로 페이지 이동.
 
### **#1** 정산 
 - 모임 명, 모임 장소, 모임 인원 설정, 모임 차수 설정 ( 최대 6차 )
 - 정산 비용 및 정산방법 설정 ( N/1, 직접 정산 )
 - 금액 절삭단위 설정 ( 모임 비용에 맞게 1원 ~ 10^n 원 )
 - 정산 계좌 등록 ( 계좌 실명인증을 통한 등록 )
 - 정산 결과 공유 ( URL링크 복사 / 카카오톡 링크 ) 
 - 그 외 정산 작성내용 확인 및 수정, 작성중인 정산내용 초기화.
 
 ![모두의정산_정산폼작성](https://user-images.githubusercontent.com/42178661/97230326-175cad80-181d-11eb-898a-35c722306cb9.gif)
 ![모두의정산_정산폼작성(2)](https://user-images.githubusercontent.com/42178661/97231276-9c949200-181e-11eb-900c-c65b8fd52eda.gif)
 ![모두의정산_정산폼작성(3)](https://user-images.githubusercontent.com/42178661/97232091-e631ac80-181f-11eb-824c-7d1ed38b69b7.gif)
 ![모두의정산_정산폼작성(4)](https://user-images.githubusercontent.com/42178661/97232651-e0889680-1820-11eb-8d9e-65923b9c24f1.gif)
 ![모두의정산_정산폼작성(5)](https://user-images.githubusercontent.com/42178661/97233521-6fe27980-1822-11eb-90df-105f1f125327.gif) 
 
 
 ##
 <*회원전용 정산폼 작성>
 
 ![모두의정산_정산폼작성(회원전용1)](https://user-images.githubusercontent.com/42178661/97233971-4544f080-1823-11eb-938d-aee6542ba455.gif)
 ![모두의정산_정산폼작성(회원전용2)](https://user-images.githubusercontent.com/42178661/97234563-6a862e80-1824-11eb-96f4-b2ca77647860.gif)
 
 
### **#2** 히스토리 - (회원 전용)
 - 정산 내역( 페이징 처리, 게시물 단위 5개 혹은 10개 설정 )
 - 각 정산 상세내역 확인
 - 상세 내역 내부 슬라이드(상하) 시, 스크롤 방향에 따른 마스크 레이웃 표시
 
 ![모두의정산_히스토리(1)](https://user-images.githubusercontent.com/42178661/97235029-5abb1a00-1825-11eb-9c11-ef0faf5cf55c.gif)
 ![모두의정산_히스토리(2)](https://user-images.githubusercontent.com/42178661/97235502-5a6f4e80-1826-11eb-8288-3559607f9434.gif)

 
### **#3** 계좌관리 - (회원 전용)
 - 관리중인 정산 계좌별로 간략 내용 확인 ( 날짜, 모임명, 정산금액 )  
 - 정산 계좌 추가 ( 최대 5개 ) 및 삭제
 
 ![모두의정산_계좌관리(1)](https://user-images.githubusercontent.com/42178661/97236043-9525b680-1827-11eb-9a36-0859e0316fcb.gif)
  
