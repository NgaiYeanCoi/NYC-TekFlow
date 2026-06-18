package xyz.nyc.tekflow;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@MapperScan("xyz.nyc.tekflow.mapper")
@ConfigurationPropertiesScan
public class TekflowApplication {
    public static void main(String[] args) {
        SpringApplication.run(TekflowApplication.class, args);
    }
}

