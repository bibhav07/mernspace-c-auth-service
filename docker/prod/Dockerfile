FROM node:18-alpine as builder

WORKDIR /app

#copying package json file in app (docker working dir)
COPY package*.json ./

#installing all the dependencies. ci means install all packages as is it with version 
RUN npm ci

#copying code from source to desti (app - docker workdir)
COPY . .

#making build in docker
RUN npm run build

#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
#this is multilayer dockerfile - so in 1st step we created a build now will use that build
FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

#ignore scripts is nothing but a security flag, that says if there are any unwanted 3rd party scripts do not run it
#also, NO dev dependency will be installed
RUN npm ci --ignore-scripts

#we are copying our code, but only selected like (--from=builder (from builder that we created), get /app/dist (dist) and copy to this path (production app path))
COPY --from=builder /app/dist ./

EXPOSE 5500

#when our container will run, run this command
CMD [ "node", "src/server.js" ];




