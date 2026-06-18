package xyz.nyc.tekflow.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import xyz.nyc.tekflow.config.TekflowProperties;
import xyz.nyc.tekflow.entity.User;
import xyz.nyc.tekflow.mapper.UserMapper;

@Component
public class AdminInitializer implements CommandLineRunner {
    private final TekflowProperties properties;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(TekflowProperties properties, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.properties = properties;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (properties.adminUsername() == null || properties.adminUsername().isBlank()
                || properties.adminPassword() == null || properties.adminPassword().isBlank()) {
            return;
        }
        User user = userMapper.findByUsername(properties.adminUsername());
        if (user == null) {
            user = new User();
            user.setUsername(properties.adminUsername());
            user.setName("TekFlow Admin");
            user.setPasswordHash(passwordEncoder.encode(properties.adminPassword()));
            user.setRole("admin");
            user.setEnabled(true);
            userMapper.insertUser(user);
            return;
        }
        user.setPasswordHash(passwordEncoder.encode(properties.adminPassword()));
        user.setEnabled(true);
        userMapper.updateUser(user);
    }
}

