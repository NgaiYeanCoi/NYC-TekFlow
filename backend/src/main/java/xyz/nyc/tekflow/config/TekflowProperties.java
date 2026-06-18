package xyz.nyc.tekflow.config;

import java.nio.file.Path;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "tekflow")
public record TekflowProperties(
        String jwtSecret,
        long jwtExpiresMinutes,
        Path uploadDir,
        String adminUsername,
        String adminPassword
) {
}

