package com.aifactory.techshare.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT认证过滤器
 * 从请求头中提取JWT Token并验证，设置Spring Security上下文
 *
 * @author AI Factory
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            // 从请求头获取Token
            String token = extractTokenFromRequest(request);

            // 验证Token并设置认证信息
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                // 从Token获取用户名
                String username = jwtUtil.getUsernameFromToken(token);

                if (StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // 加载用户详情
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // 创建认证Token
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // 设置请求详情
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 将认证信息存入Security上下文
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    log.debug("JWT认证成功: 用户={}, 角色={}", username, userDetails.getAuthorities());
                }
            }
        } catch (Exception e) {
            log.error("JWT认证处理失败: {}", e.getMessage());
            // 清除上下文，但不阻止请求继续
            SecurityContextHolder.clearContext();
        }

        // 继续过滤器链
        filterChain.doFilter(request, response);
    }

    /**
     * 从请求头提取JWT Token
     *
     * @param request HTTP请求
     * @return Token字符串，不存在则返回null
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(jwtUtil.getHeader());

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtUtil.getPrefix())) {
            // 去除"Bearer "前缀
            return bearerToken.substring(jwtUtil.getPrefix().length());
        }

        return null;
    }

}
