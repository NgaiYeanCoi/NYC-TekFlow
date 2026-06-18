package xyz.nyc.tekflow.security;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import xyz.nyc.tekflow.config.TekflowProperties;

class JwtServiceTest {
    @Test
    void issueAndParseToken() {
        TekflowProperties properties = new TekflowProperties(
                "unit-test-secret-with-enough-length",
                60,
                Path.of("./uploads"),
                "",
                ""
        );
        JwtService service = new JwtService(properties);

        String token = service.issueToken(1L, "admin", "admin");

        assertEquals("admin", service.parse(token).getSubject());
        assertEquals("admin", service.parse(token).get("role", String.class));
    }
}

