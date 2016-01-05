FROM node
MAINTAINER Warren Seymour <warren@radify.io>

COPY . /usr/local/compose-backup

WORKDIR /usr/local/compose-backup
RUN npm install && \
	node_modules/.bin/gulp build && \
	npm prune --production

CMD ["node", "/usr/local/compose-backup"]
