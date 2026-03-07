package com.aifactory.techshare.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) 配置类
 * 配置 API 文档信息和 JWT 认证
 *
 * @author AI Factory
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    /**
     * 配置 OpenAPI 文档
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                // API 基本信息
                .info(new Info()
                        .title("技术分享站 API")
                        .description("""
                                ## 技术分享网站后端 API 文档

                                ### 接口说明
                                - 用户端接口：无需登录即可访问
                                - 管理端接口：需要 JWT Token 认证

                                ### 认证方式
                                在请求头中添加 Authorization: Bearer {token}

                                ### 响应格式
                                所有接口统一返回格式：
                                ```json
                                {
                                  "code": 200,
                                  "message": "操作成功",
                                  "data": { ... }
                                }
                                ```
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("AI Factory")
                                .email("support@aifactory.com")
                                .url("https://aifactory.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                // JWT 认证配置
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name("Authorization")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("请输入 JWT Token，格式：Bearer {token}")));
    }

}
