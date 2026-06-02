FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./
COPY requirements.txt .

# install project dependencies
RUN npm install -r requirements.txt

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host" ]
