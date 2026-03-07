package com.aifactory.techshare.controller;

import com.aifactory.techshare.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 *
 * @author AI Factory
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    /**
     * 健康检查接口
     */
    @GetMapping("/health")
    public Result<Map<String, Object>> health() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("service", "tech-share");
        data.put("version", "1.0.0");
        return Result.success(data);
    }

    /**
     * 根路径接口
     */
    @GetMapping("/")
    public Result<String> index() {
        return Result.success("Welcome to Tech Share API!");
    }

}
