FROM golang:1.25-bookworm AS builder

WORKDIR /src

# go.mod pins a toolchain newer than this base image's bundled go;
# GOTOOLCHAIN=auto lets `go` fetch and use it automatically.
ENV GOTOOLCHAIN=auto

COPY go.mod go.sum ./
RUN go mod download

COPY . .
ARG TARGET=api
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/server ./commands/${TARGET}

FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /out/server /server

EXPOSE 8080

ENTRYPOINT ["/server"]
