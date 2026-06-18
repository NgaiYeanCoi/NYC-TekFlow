package xyz.nyc.tekflow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI tekflowOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("TekFlow 接口文档")
                        .version("V1.0.0")
                        .description("TekFlow 个人知识工作台 API。接口统一使用 /api/v1 前缀，响应结构为 { code, msg, data }。")
                        .contact(new Contact().name("TekFlow Admin")))
                .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("后台接口使用 Authorization: Bearer <token> 认证。")));
    }
}
