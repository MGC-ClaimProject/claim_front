# ✅ Node.js 18 버전 이미지 사용
FROM node:18

# ✅ 작업 디렉토리 설정
WORKDIR /app

# ✅ package.json 및 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# ✅ 프로젝트 코드 복사
COPY . .

# ✅ 포트 설정
EXPOSE 5173

# ✅ React 개발 서버 실행
CMD ["npm", "run", "dev"]
