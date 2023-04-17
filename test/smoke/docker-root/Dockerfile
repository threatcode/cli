FROM node:16

COPY ./smoke/ /threatcode/smoke/
COPY ./fixtures/ /threatcode/fixtures/

RUN apt-get update && apt-get install -y curl jq
RUN /threatcode/smoke/install-shellspec.sh --yes
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /threatcode/smoke/

ENTRYPOINT [ "./docker-root/entrypoint.sh" ]
