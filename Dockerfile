# ------------------------------------------------------------------------------
# Test image backend
# ------------------------------------------------------------------------------
FROM golang:1.12.5-alpine3.9 AS backend_test_img

RUN apk update && apk upgrade && apk add --no-cache git

ENV APP_DIR=shopper/backend/
RUN mkdir -p $APP_DIR
COPY ./backend $APP_DIR
WORKDIR $APP_DIR
CMD ["go", "test"]

# ------------------------------------------------------------------------------
# Development image backend
# ------------------------------------------------------------------------------
FROM backend_test_img AS dev_img
RUN mkdir /config
RUN cp -r /go/shopper/backend/config/* /config/
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
   go build -gcflags "all=-N -l" -o /shopper cmd/main.go
ENTRYPOINT /shopper

# ------------------------------------------------------------------------------
# Development image frontend
# ------------------------------------------------------------------------------
FROM node:8.16 as frontend-build
WORKDIR /usr/src/app
COPY frontend/package.json ./
RUN yarn
COPY frontend/src ./src/
COPY frontend/public/* ./public/
RUN yarn install
RUN yarn build
RUN find /usr/src/app | grep -v node_modules

# ------------------------------------------------------------------------------
# Production image
# ------------------------------------------------------------------------------
FROM alpine:3.7 as prod_img
COPY --from=dev_img /shopper /
COPY --from=dev_img /config /config
COPY --from=frontend-build /usr/src/app/build /build/
EXPOSE 3500
ENTRYPOINT /shopper
