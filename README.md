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

#### Front
 - HTML, CSS ( SCSS ), Javascript ( ES6 )
 - React.js
 - Redux
 
#### Back
 - Python, Django ( REST-API )

#### DB
 - MySQL

#### 오픈 API 사용현황
 - Iamport API ( 계좌 실명인증 )
 - Kakao Link ( 카카오톡 공유 )
     
## 
> ## 서비스 주요기능

### **#0** 메인(홈)

 ![모두의정산_홈화면](https://user-images.githubusercontent.com/42178661/97228837-cea3f500-181a-11eb-8665-a786ed1f4fdf.gif)
 ![모두의정산_홈화면(회원전용)](https://user-images.githubusercontent.com/42178661/97229041-19257180-181b-11eb-96ff-c942580a443d.gif)


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
 
 ![모두의정산_히스토리(1)](https://user-images.githubusercontent.com/42178661/97235029-5abb1a00-1825-11eb-9c11-ef0faf5cf55c.gif)
 ![모두의정산_히스토리(2)](https://user-images.githubusercontent.com/42178661/97235502-5a6f4e80-1826-11eb-8288-3559607f9434.gif)

 
### **#3** 계좌관리 - (회원 전용)
 - 관리중인 정산 계좌별로 간략 내용 확인 ( 날짜, 모임명, 정산금액 )  
 - 정산 계좌 추가 ( 최대 5개 ) 및 삭제
 
 ![모두의정산_계좌관리(1)](https://user-images.githubusercontent.com/42178661/97236043-9525b680-1827-11eb-9a36-0859e0316fcb.gif)
  
