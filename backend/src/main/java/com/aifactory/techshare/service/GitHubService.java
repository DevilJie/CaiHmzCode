package com.aifactory.techshare.service;

import com.aifactory.techshare.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * GitHub API服务
 * 用于获取GitHub仓库的README内容
 *
 * @author AI Factory
 */
@Slf4j
@Service
public class GitHubService {

    private static final String GITHUB_API_BASE_URL = "https://api.github.com";
    private static final Pattern GITHUB_URL_PATTERN = Pattern.compile(
            "https?://github\\.com/([^/]+)/([^/]+)/?.*"
    );

    private final SystemConfigService systemConfigService;
    private final WebClient webClient;

    public GitHubService(SystemConfigService systemConfigService) {
        this.systemConfigService = systemConfigService;
        this.webClient = WebClient.builder()
                .baseUrl(GITHUB_API_BASE_URL)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }

    /**
     * 获取GitHub Token（从系统配置获取）
     */
    private String getGithubToken() {
        return systemConfigService.getConfigValue("GITHUB_TOKEN");
    }

    /**
     * 从GitHub URL解析owner和repo名称
     *
     * @param githubUrl GitHub仓库URL
     * @return 包含owner和repo的数组，如果解析失败返回null
     */
    public String[] parseGitHubUrl(String githubUrl) {
        if (githubUrl == null || githubUrl.isBlank()) {
            return null;
        }

        Matcher matcher = GITHUB_URL_PATTERN.matcher(githubUrl.trim());
        if (matcher.matches()) {
            String owner = matcher.group(1);
            String repo = matcher.group(2);
            // 移除 .git 后缀
            if (repo.endsWith(".git")) {
                repo = repo.substring(0, repo.length() - 4);
            }
            return new String[]{owner, repo};
        }
        return null;
    }

    /**
     * 获取GitHub仓库的README内容
     *
     * @param githubUrl GitHub仓库URL
     * @return README内容（Markdown格式）
     */
    public String fetchReadme(String githubUrl) {
        String[] parts = parseGitHubUrl(githubUrl);
        if (parts == null) {
            log.warn("无效的GitHub URL: {}", githubUrl);
            return null;
        }

        String owner = parts[0];
        String repo = parts[1];
        return fetchReadme(owner, repo);
    }

    /**
     * 获取GitHub仓库的README内容
     *
     * @param owner 仓库所有者
     * @param repo  仓库名称
     * @return README内容（Markdown格式）
     */
    public String fetchReadme(String owner, String repo) {
        try {
            log.info("正在获取GitHub README: {}/{}", owner, repo);

            WebClient.RequestHeadersSpec<?> request = webClient.get()
                    .uri("/repos/{owner}/{repo}/readme", owner, repo);

            // 添加Token认证（如果配置了）
            String token = getGithubToken();
            if (token != null && !token.isBlank()) {
                request.header("Authorization", "Bearer " + token);
            }

            GitHubReadmeResponse response = request
                    .retrieve()
                    .bodyToMono(GitHubReadmeResponse.class)
                    .block();

            if (response != null && response.getContent() != null) {
                // GitHub API返回的content是Base64编码的
                String content = decodeBase64(response.getContent());
                log.info("成功获取README内容，长度: {}", content.length());
                return content;
            }

            log.warn("未找到README内容: {}/{}", owner, repo);
            return null;

        } catch (Exception e) {
            log.error("获取GitHub README失败: {}/{} - {}", owner, repo, e.getMessage());
            // 404错误不抛出异常，返回null
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                return null;
            }
            throw new BusinessException(500, "获取GitHub README失败: " + e.getMessage());
        }
    }

    /**
     * 解码Base64内容
     */
    private String decodeBase64(String base64Content) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Content.replace("\n", ""));
            return new String(decodedBytes);
        } catch (Exception e) {
            log.error("Base64解码失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * GitHub API返回的README响应结构
     */
    private static class GitHubReadmeResponse {
        private String name;
        private String path;
        private String sha;
        private Long size;
        private String url;
        private String htmlUrl;
        private String gitUrl;
        private String downloadUrl;
        private String type;
        private String content;
        private String encoding;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public String getSha() {
            return sha;
        }

        public void setSha(String sha) {
            this.sha = sha;
        }

        public Long getSize() {
            return size;
        }

        public void setSize(Long size) {
            this.size = size;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getHtmlUrl() {
            return htmlUrl;
        }

        public void setHtmlUrl(String htmlUrl) {
            this.htmlUrl = htmlUrl;
        }

        public String getGitUrl() {
            return gitUrl;
        }

        public void setGitUrl(String gitUrl) {
            this.gitUrl = gitUrl;
        }

        public String getDownloadUrl() {
            return downloadUrl;
        }

        public void setDownloadUrl(String downloadUrl) {
            this.downloadUrl = downloadUrl;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getEncoding() {
            return encoding;
        }

        public void setEncoding(String encoding) {
            this.encoding = encoding;
        }
    }

}
