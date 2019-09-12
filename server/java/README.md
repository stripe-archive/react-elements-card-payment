# Name of sample

## Requirements

- Maven
- Java

1. Build the jar

```
mvn package
```

2. Run the packaged jar

```
SPARK_LOCAL_IP=0.0.0.0 java -cp target/react-1.0.0-SNAPSHOT-jar-with-dependencies.jar com.stripe.sample.Server
```

3. Go to `localhost:4242` in your browser to see the demo
