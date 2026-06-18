package xyz.nyc.tekflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import xyz.nyc.tekflow.config.TekflowProperties;

@Service
public class JwtService {
    private final TekflowProperties properties;
    private final SecretKey key;

    public JwtService(TekflowProperties properties) {
        this.properties = properties;
        this.key = Keys.hmacShaKeyFor(sha256(properties.jwtSecret()));
    }

    public String issueToken(Long userId, String username, String role) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(properties.jwtExpiresMinutes() * 60);
        return Jwts.builder()
                .subject(username)
                .claim("uid", userId)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public long expiresAtEpochMillis() {
        return Instant.now().plusSeconds(properties.jwtExpiresMinutes() * 60).toEpochMilli();
    }

    private byte[] sha256(String value) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            throw new IllegalStateException("Cannot initialize JWT secret", ex);
        }
    }
}

