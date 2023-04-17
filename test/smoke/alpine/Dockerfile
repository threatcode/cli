FROM shellspec/shellspec:latest

COPY ./smoke/ /threatcode/smoke/
COPY ./fixtures/ /threatcode/fixtures/

RUN shellspec --version
RUN apk add curl jq libgcc libstdc++

WORKDIR /threatcode/smoke/

ENTRYPOINT [ "./alpine/entrypoint.sh" ]
