# This is a multi-stage build.

# Usage:
# docker build -t linuxacademy/stress-web-app .
# docker run --rm linuxacademy/stress-web-app -p 8080:8080

# build stage
FROM golang:1.10 AS builder
WORKDIR /go/src/github.com/linuxacademy/stress-web-app
COPY main.go .
RUN go get -d -v
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

# final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /go/src/github.com/linuxacademy/stress-web-app/app .

# Metadata params
ARG VERSION
ARG BUILD_DATE
ARG VCS_URL
ARG VCS_REF
ARG NAME
ARG VENDOR

# Metadata
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.name=$NAME \
      org.label-schema.description="Stress test web app" \
      org.label-schema.url="https://linuxacademy.com" \
      org.label-schema.vcs-url=https://github.com/linuxacademy/$VCS_URL \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vendor=$VENDOR \
      org.label-schema.version=$VERSION \
      org.label-schema.docker.schema-version="1.0" \
      org.label-schema.docker.cmd="docker run -d linuxacademy/stress-web-app"

CMD ["./app"]
EXPOSE 8080