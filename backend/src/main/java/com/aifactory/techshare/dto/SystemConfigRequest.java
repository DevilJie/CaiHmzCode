package com.aifactory.techshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

/**
 * 系统配置更新请求DTO
 *
 * @author AI Factory
 */
@Data
public class SystemConfigRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 网站名称
     */
    @NotBlank(message = "网站名称不能为空")
    private String siteName;

    /**
     * ICP备案号
     */
    private String icpNumber;

    /**
     * 页脚文字
     */
    private String footerText;

    /**
     * GitHub Token
     */
    private String githubToken;

}
