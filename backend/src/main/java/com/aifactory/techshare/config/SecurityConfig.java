package com.aifactory.techshare.config;

import com.aifactory.techshare.security.JwtAuthenticationFilter;
import com.aifactory.techshare.security.SecurityAccessDeniedHandler;
import com.aifactory.techshare.security.SecurityAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security配置类
 * 配置JWT认证、路径权限和CORS
 *
 * @author AI Factory
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final SecurityAuthenticationEntryPoint authenticationEntryPoint;
    private final SecurityAccessDeniedHandler accessDeniedHandler;

    /**
     * 密码编码器
     * 使用BCrypt加密算法
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 安全过滤器链配置
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用CSRF（使用JWT无需CSRF保护）
                .csrf(AbstractHttpConfigurer::disable)

                // 配置CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 配置Session管理：无状态Session
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 配置异常处理
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )

                // 配置请求授权
                .authorizeHttpRequests(auth -> auth
                        // 允许静态资源访问（上传的文件）
                        .requestMatchers("/uploads/**").permitAll()
                        // 开放登录接口
                        .requestMatchers("/api/v1/admin/auth/login").permitAll()
                        // 开放健康检查接口
                        .requestMatchers("/actuator/**").permitAll()
                        // 开放用户端API（无需登录）
                        .requestMatchers("/api/v1/projects").permitAll()
                        .requestMatchers("/api/v1/projects/**").permitAll()
                        .requestMatchers("/api/v1/blogs").permitAll()
                        .requestMatchers("/api/v1/blogs/**").permitAll()
                        .requestMatchers("/api/v1/blog-categories").permitAll()
                        .requestMatchers("/api/v1/blog-tags").permitAll()
                        .requestMatchers("/api/v1/feedbacks").permitAll()
                        .requestMatchers("/api/v1/feedbacks/**").permitAll()
                        .requestMatchers("/api/v1/advertisements").permitAll()
                        .requestMatchers("/api/v1/advertisements/**").permitAll()
                        .requestMatchers("/api/v1/system/info").permitAll()
                        .requestMatchers("/api/v1/donation-qrcodes").permitAll()
                        .requestMatchers("/api/v1/donation-qrcodes/**").permitAll()
                        // 保护管理端API（需要认证）
                        .requestMatchers("/api/v1/admin/**").authenticated()
                        // 其他请求需要认证
                        .anyRequest().authenticated()
                )

                // 添加JWT过滤器
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS配置
     * 允许前端跨域访问
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 允许的来源（开发环境允许所有来源，生产环境应配置具体域名）
        configuration.setAllowedOriginPatterns(List.of("*"));

        // 允许的HTTP方法
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // 允许的请求头
        configuration.setAllowedHeaders(List.of("*"));

        // 允许携带凭证（Cookies等）
        configuration.setAllowCredentials(true);

        // 预检请求的缓存时间（秒）
        configuration.setMaxAge(3600L);

        // 暴露的响应头
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
