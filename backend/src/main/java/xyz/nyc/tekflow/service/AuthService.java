package xyz.nyc.tekflow.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.nyc.tekflow.dto.AuthDtos.LoginRequest;
import xyz.nyc.tekflow.dto.AuthDtos.LoginResponse;
import xyz.nyc.tekflow.dto.AuthDtos.UserSummary;
import xyz.nyc.tekflow.entity.User;
import xyz.nyc.tekflow.mapper.UserMapper;
import xyz.nyc.tekflow.security.JwtService;
import xyz.nyc.tekflow.security.UserPrincipal;

@Service
public class AuthService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ResponseMapper responseMapper;

    public AuthService(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtService jwtService, ResponseMapper responseMapper) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.responseMapper = responseMapper;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userMapper.findActiveByUsername(request.username());
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Bad credentials");
        }
        String token = jwtService.issueToken(user.getId(), user.getUsername(), user.getRole());
        return new LoginResponse(token, jwtService.expiresAtEpochMillis(), responseMapper.user(user));
    }

    public UserSummary currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new BadCredentialsException("No user");
        }
        User user = userMapper.findActiveByUsername(principal.getUsername());
        if (user == null) {
            throw new BadCredentialsException("No user");
        }
        return responseMapper.user(user);
    }
}

