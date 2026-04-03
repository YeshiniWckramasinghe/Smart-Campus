package com.sliit.paf.smart_campus.auth.service;

import com.sliit.paf.smart_campus.auth.model.Role;
import com.sliit.paf.smart_campus.auth.model.User;
import com.sliit.paf.smart_campus.auth.repository.UserRepository;
import com.sliit.paf.smart_campus.auth.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // User already exists check කරන්න — නැත්නම් create කරන්න
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword("");
            user.setRole(Role.LECTURER); // Default role
            userRepository.save(user);
        }

        // JWT Token generate කරන්න
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // Token එක response එකේ redirect URL එකට add කරන්න
        response.sendRedirect("http://localhost:3000/oauth2/success?token=" + token
                + "&role=" + user.getRole().name()
                + "&name=" + user.getName());
    }
}