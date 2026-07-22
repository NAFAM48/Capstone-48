# Builder stage
FROM maven:3.10.1-jdk-17 AS builder
WORKDIR /app

COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B -q -Dmaven.repo.local=/root/.m2/repository dependency:go-offline

COPY src ./src
RUN ./mvnw -B package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/toy-factory-backend-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
