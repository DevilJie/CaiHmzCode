package com.aifactory.techshare.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT工具类
 * 负责Token的生成、解析和验证
 *
 * @author AI Factory
 */
@Slf4j
@Component
public class JwtUtil {

    /**
     * JWT签名密钥
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * JWT过期时间（毫秒）
     */
    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * JWT请求头名称
     */
    @Value("${jwt.header}")
    private String header;

    /**
     * JWT Token前缀
     */
    @Value("${jwt.prefix}")
    private String prefix;

    /**
     * 获取签名密钥
     * 将配置的字符串密钥转换为符合HMAC-SHA算法要求的SecretKey对象
     *
     * @return SecretKey对象
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 生成JWT Token
     *
     * @param username 用户名
     * @param role     用户角色
     * @return JWT Token字符串
     */
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 从Token中获取用户名
     *
     * @param token JWT Token
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = parseToken(token);
            return claims != null ? claims.getSubject() : null;
        } catch (Exception e) {
            log.error("从Token获取用户名失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从Token中获取角色
     *
     * @param token JWT Token
     * @return 用户角色
     */
    public String getRoleFromToken(String token) {
        try {
            Claims claims = parseToken(token);
            return claims != null ? claims.get("role", String.class) : null;
        } catch (Exception e) {
            log.error("从Token获取角色失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 解析Token获取Claims
     *
     * @param token JWT Token
     * @return Claims对象，解析失败返回null
     */
    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            log.warn("JWT Token已过期: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("JWT Token解析失败: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT Token为空或无效: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 验证Token是否有效
     *
     * @param token JWT Token
     * @return true-有效，false-无效
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT Token已过期: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("JWT Token无效: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT Token为空: {}", e.getMessage());
        }
        return false;
    }

    /**
     * 检查Token是否即将过期（小于1天）
     *
     * @param token JWT Token
     * @return true-即将过期，false-未即将过期
     */
    public boolean isTokenExpiringSoon(String token) {
        try {
            Claims claims = parseToken(token);
            if (claims == null) {
                return true;
            }
            Date expiration = claims.getExpiration();
            // 如果剩余时间小于1天，则认为即将过期
            long oneDayInMillis = 24 * 60 * 60 * 1000L;
            return expiration.getTime() - System.currentTimeMillis() < oneDayInMillis;
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * 获取请求头名称
     *
     * @return 请求头名称
     */
    public String getHeader() {
        return header;
    }

    /**
     * 获取Token前缀
     *
     * @return Token前缀
     */
    public String getPrefix() {
        return prefix;
    }

}
