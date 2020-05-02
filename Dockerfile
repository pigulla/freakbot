FROM node:14

ARG DEBIAN_FRONTEND=noninteractive
ARG NPM_PACKAGES=/app/npm

ENV HOME=/app
ENV VOICEPACK_PATH '/app/FFFVoicePack'

USER root
RUN groupadd --system freakbot && useradd --no-log-init --system --gid freakbot freakbot
RUN apt-get update && apt-get install --yes --no-install-recommends bash ffmpeg

WORKDIR /app
RUN chown freakbot:freakbot -R /app
USER freakbot

COPY --chown=freakbot:freakbot package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY --chown=freakbot:freakbot src/ src/
COPY --chown=freakbot:freakbot config/default.json config/
COPY --chown=freakbot:freakbot config/custom-environment-variables.json config/

RUN npm ci
RUN npm run build

RUN git clone https://github.com/Craiel/FFFVoicePack.git

ENTRYPOINT ["npm", "start"]
