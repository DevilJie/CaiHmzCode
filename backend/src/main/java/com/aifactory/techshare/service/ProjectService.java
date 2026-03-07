package com.aifactory.techshare.service;

import com.aifactory.techshare.common.PageResult;
import com.aifactory.techshare.dto.AdminProjectListRequest;
import com.aifactory.techshare.dto.ProjectCreateRequest;
import com.aifactory.techshare.dto.ProjectDetailResponse;
import com.aifactory.techshare.dto.ProjectListRequest;
import com.aifactory.techshare.dto.ProjectResponse;
import com.aifactory.techshare.dto.ProjectUpdateRequest;
import com.aifactory.techshare.entity.Project;
import com.aifactory.techshare.entity.ProjectReadme;
import com.aifactory.techshare.exception.BusinessException;
import com.aifactory.techshare.mapper.ProjectMapper;
import com.aifactory.techshare.mapper.ProjectReadmeMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

/**
 * 项目管理服务
 *
 * @author AI Factory
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectMapper projectMapper;
    private final ProjectReadmeMapper projectReadmeMapper;
    private final ObjectMapper objectMapper;

    @Value("${github.token:}")
    private String githubToken;

    /**
     * 管理端分页查询项目列表
     *
     * @param request 查询参数
     * @return 分页结果
     */
    public PageResult<ProjectResponse> getAdminProjectList(AdminProjectListRequest request) {
        // 构建查询条件
        LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<>();

        // 关键词搜索（项目名称模糊匹配）
        if (StringUtils.hasText(request.getKeyword())) {
            queryWrapper.like(Project::getName, request.getKeyword());
        }

        // 按是否显示筛选
        if (request.getIsShow() != null) {
            queryWrapper.eq(Project::getIsShow, request.getIsShow());
        }

        // 按排序权重降序、创建时间降序排列
        queryWrapper.orderByDesc(Project::getSortOrder)
                .orderByDesc(Project::getCreateTime);

        // 分页查询
        Page<Project> page = new Page<>(request.getPageNum(), request.getPageSize());
        Page<Project> result = projectMapper.selectPage(page, queryWrapper);

        // 转换为响应DTO
        List<ProjectResponse> responseList = result.getRecords().stream()
                .map(this::convertToResponse)
                .toList();

        return new PageResult<>(responseList, result.getTotal(), result.getCurrent(), result.getSize());
    }

    /**
     * 根据ID获取项目详情
     *
     * @param id 项目ID
     * @return 项目详情
     */
    public ProjectResponse getProjectById(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(404, "项目不存在");
        }
        return convertToResponse(project);
    }

    /**
     * 新增项目
     *
     * @param request 新增请求
     * @return 项目详情
     */
    @Transactional(rollbackFor = Exception.class)
    public ProjectResponse createProject(ProjectCreateRequest request) {
        // 检查项目名称是否重复
        LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<Project>()
                .eq(Project::getName, request.getName());
        if (projectMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException(400, "项目名称已存在");
        }

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setProjectUrl(request.getProjectUrl());
        project.setGithubUrl(request.getGithubUrl());
        project.setCoverImage(request.getCoverImage());
        project.setTechTags(convertTechTagsToJson(request.getTechTags()));
        project.setSortOrder(request.getSortOrder());
        project.setIsShow(request.getIsShow());
        project.setViewCount(0);

        projectMapper.insert(project);
        log.info("创建项目成功: id={}, name={}", project.getId(), project.getName());

        return convertToResponse(project);
    }

    /**
     * 更新项目
     *
     * @param id      项目ID
     * @param request 更新请求
     * @return 项目详情
     */
    @Transactional(rollbackFor = Exception.class)
    public ProjectResponse updateProject(Long id, ProjectUpdateRequest request) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(404, "项目不存在");
        }

        // 检查项目名称是否重复（排除自身）
        if (StringUtils.hasText(request.getName()) && !request.getName().equals(project.getName())) {
            LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<Project>()
                    .eq(Project::getName, request.getName())
                    .ne(Project::getId, id);
            if (projectMapper.selectCount(queryWrapper) > 0) {
                throw new BusinessException(400, "项目名称已存在");
            }
        }

        // 构建更新条件
        LambdaUpdateWrapper<Project> updateWrapper = new LambdaUpdateWrapper<Project>()
                .eq(Project::getId, id);

        if (StringUtils.hasText(request.getName())) {
            updateWrapper.set(Project::getName, request.getName());
        }
        if (request.getDescription() != null) {
            updateWrapper.set(Project::getDescription, request.getDescription());
        }
        if (request.getProjectUrl() != null) {
            updateWrapper.set(Project::getProjectUrl, request.getProjectUrl());
        }
        if (request.getGithubUrl() != null) {
            updateWrapper.set(Project::getGithubUrl, request.getGithubUrl());
        }
        if (request.getCoverImage() != null) {
            updateWrapper.set(Project::getCoverImage, request.getCoverImage());
        }
        if (request.getTechTags() != null) {
            updateWrapper.set(Project::getTechTags, convertTechTagsToJson(request.getTechTags()));
        }
        if (request.getSortOrder() != null) {
            updateWrapper.set(Project::getSortOrder, request.getSortOrder());
        }
        if (request.getIsShow() != null) {
            updateWrapper.set(Project::getIsShow, request.getIsShow());
        }

        projectMapper.update(null, updateWrapper);
        log.info("更新项目成功: id={}", id);

        return getProjectById(id);
    }

    /**
     * 删除项目（逻辑删除）
     *
     * @param id 项目ID
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteProject(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(404, "项目不存在");
        }

        projectMapper.deleteById(id);
        log.info("删除项目成功: id={}, name={}", id, project.getName());
    }

    /**
     * 手动同步README
     *
     * @param id 项目ID
     * @return 是否成功
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean syncReadme(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(404, "项目不存在");
        }

        String githubUrl = project.getGithubUrl();
        if (!StringUtils.hasText(githubUrl)) {
            throw new BusinessException(400, "项目未配置GitHub地址");
        }

        // 解析GitHub URL，获取owner和repo
        String[] parts = parseGitHubUrl(githubUrl);
        if (parts == null) {
            throw new BusinessException(400, "GitHub地址格式不正确");
        }

        String owner = parts[0];
        String repo = parts[1];

        try {
            // 调用GitHub API获取README内容
            String readmeContent = fetchReadmeFromGitHub(owner, repo);

            // 保存或更新README缓存
            saveReadmeCache(id, readmeContent);

            log.info("同步README成功: projectId={}, owner={}, repo={}", id, owner, repo);
            return true;
        } catch (Exception e) {
            log.error("同步README失败: projectId={}, error={}", id, e.getMessage());
            throw new BusinessException("同步README失败: " + e.getMessage());
        }
    }

    /**
     * 解析GitHub URL
     *
     * @param githubUrl GitHub URL
     * @return [owner, repo] 或 null
     */
    private String[] parseGitHubUrl(String githubUrl) {
        if (!StringUtils.hasText(githubUrl)) {
            return null;
        }

        // 移除末尾的斜杠和.git后缀
        String url = githubUrl.trim();
        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        if (url.endsWith(".git")) {
            url = url.substring(0, url.length() - 4);
        }

        // 解析 https://github.com/owner/repo 格式
        String[] parts = url.split("/");
        if (parts.length >= 2) {
            String repo = parts[parts.length - 1];
            String owner = parts[parts.length - 2];
            return new String[]{owner, repo};
        }

        return null;
    }

    /**
     * 从GitHub API获取README内容
     *
     * @param owner 仓库所有者
     * @param repo  仓库名称
     * @return README内容
     */
    private String fetchReadmeFromGitHub(String owner, String repo) {
        String apiUrl = String.format("https://api.github.com/repos/%s/%s/readme", owner, repo);

        WebClient.Builder builder = WebClient.builder()
                .baseUrl("https://api.github.com")
                .defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github.v3.raw")
                .defaultHeader(HttpHeaders.USER_AGENT, "TechShare-App");

        // 如果配置了GitHub Token，添加认证头
        if (StringUtils.hasText(githubToken)) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + githubToken);
        }

        WebClient webClient = builder.build();

        try {
            return webClient.get()
                    .uri("/repos/{owner}/{repo}/readme", owner, repo)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            log.error("获取GitHub README失败: {}", e.getMessage());
            throw new BusinessException("获取GitHub README失败: " + e.getMessage());
        }
    }

    /**
     * 保存README缓存
     *
     * @param projectId     项目ID
     * @param readmeContent README内容
     */
    private void saveReadmeCache(Long projectId, String readmeContent) {
        // 查询是否已存在缓存
        LambdaQueryWrapper<ProjectReadme> queryWrapper = new LambdaQueryWrapper<ProjectReadme>()
                .eq(ProjectReadme::getProjectId, projectId);
        ProjectReadme existingReadme = projectReadmeMapper.selectOne(queryWrapper);

        LocalDateTime now = LocalDateTime.now();

        if (existingReadme != null) {
            // 更新现有缓存
            LambdaUpdateWrapper<ProjectReadme> updateWrapper = new LambdaUpdateWrapper<ProjectReadme>()
                    .eq(ProjectReadme::getProjectId, projectId)
                    .set(ProjectReadme::getReadmeContent, readmeContent)
                    .set(ProjectReadme::getLastSyncTime, now);
            projectReadmeMapper.update(null, updateWrapper);
        } else {
            // 创建新缓存
            ProjectReadme readme = new ProjectReadme();
            readme.setProjectId(projectId);
            readme.setReadmeContent(readmeContent);
            readme.setLastSyncTime(now);
            projectReadmeMapper.insert(readme);
        }
    }

    /**
     * 将技术标签列表转换为JSON字符串
     *
     * @param techTags 技术标签列表
     * @return JSON字符串
     */
    private String convertTechTagsToJson(List<String> techTags) {
        if (techTags == null || techTags.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(techTags);
        } catch (JsonProcessingException e) {
            log.error("技术标签JSON转换失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将JSON字符串转换为技术标签列表
     *
     * @param json JSON字符串
     * @return 技术标签列表
     */
    private List<String> convertJsonToTechTags(String json) {
        if (!StringUtils.hasText(json)) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.error("技术标签JSON解析失败: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * 将实体转换为响应DTO
     *
     * @param project 项目实体
     * @return 响应DTO
     */
    private ProjectResponse convertToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .projectUrl(project.getProjectUrl())
                .githubUrl(project.getGithubUrl())
                .coverImage(project.getCoverImage())
                .techTags(convertJsonToTechTags(project.getTechTags()))
                .sortOrder(project.getSortOrder())
                .isShow(project.getIsShow())
                .viewCount(project.getViewCount())
                .createTime(project.getCreateTime())
                .updateTime(project.getUpdateTime())
                .build();
    }

    // ==================== 用户端接口 ====================

    /**
     * README缓存有效期（小时）
     */
    private static final int README_CACHE_HOURS = 24;

    /**
     * 获取用户端项目列表（分页，只返回显示的项目）
     *
     * @param request 查询参数
     * @return 分页项目列表
     */
    public PageResult<ProjectResponse> getUserProjectList(ProjectListRequest request) {
        Page<Project> page = new Page<>(request.getPageNum(), request.getPageSize());

        LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<>();
        // 只查询显示的项目
        queryWrapper.eq(Project::getIsShow, 1);

        // 关键词搜索
        if (StringUtils.hasText(request.getKeyword())) {
            queryWrapper.like(Project::getName, request.getKeyword());
        }

        // 技术标签筛选
        if (StringUtils.hasText(request.getTechTag())) {
            queryWrapper.like(Project::getTechTags, request.getTechTag());
        }

        // 按排序值降序，创建时间降序
        queryWrapper.orderByDesc(Project::getSortOrder)
                .orderByDesc(Project::getCreateTime);

        Page<Project> projectPage = projectMapper.selectPage(page, queryWrapper);

        List<ProjectResponse> responseList = projectPage.getRecords().stream()
                .map(this::convertToResponse)
                .toList();

        return new PageResult<>(
                responseList,
                projectPage.getTotal(),
                projectPage.getCurrent(),
                projectPage.getSize()
        );
    }

    /**
     * 获取用户端项目详情（含README）
     *
     * @param id 项目ID
     * @return 项目详情
     */
    public ProjectDetailResponse getUserProjectDetail(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null || project.getIsShow() != 1) {
            throw new BusinessException(404, "项目不存在");
        }

        // 获取README内容
        String readmeContent = getReadmeContentWithCache(project);

        return ProjectDetailResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .projectUrl(project.getProjectUrl())
                .githubUrl(project.getGithubUrl())
                .coverImage(project.getCoverImage())
                .techTags(convertJsonToTechTags(project.getTechTags()))
                .viewCount(project.getViewCount())
                .readmeContent(readmeContent)
                .createTime(project.getCreateTime())
                .updateTime(project.getUpdateTime())
                .build();
    }

    /**
     * 增加项目浏览次数
     *
     * @param id 项目ID
     */
    @Transactional
    public void incrementViewCount(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(404, "项目不存在");
        }

        projectMapper.update(null, new LambdaUpdateWrapper<Project>()
                .eq(Project::getId, id)
                .set(Project::getViewCount, project.getViewCount() + 1)
        );

        log.info("项目浏览次数+1: projectId={}, viewCount={}", id, project.getViewCount() + 1);
    }

    /**
     * 获取README内容（优先从缓存获取）
     *
     * @param project 项目实体
     * @return README内容
     */
    private String getReadmeContentWithCache(Project project) {
        // 如果没有GitHub地址，返回null
        if (!StringUtils.hasText(project.getGithubUrl())) {
            return null;
        }

        // 查询缓存
        ProjectReadme cachedReadme = projectReadmeMapper.selectOne(
                new LambdaQueryWrapper<ProjectReadme>()
                        .eq(ProjectReadme::getProjectId, project.getId())
        );

        // 检查缓存是否有效（24小时内）
        if (cachedReadme != null && cachedReadme.getLastSyncTime() != null) {
            LocalDateTime expireTime = cachedReadme.getLastSyncTime().plusHours(README_CACHE_HOURS);
            if (LocalDateTime.now().isBefore(expireTime)) {
                log.debug("使用缓存的README: projectId={}", project.getId());
                return cachedReadme.getReadmeContent();
            }
        }

        // 从GitHub获取README
        String readmeContent = fetchReadmeFromGitHubByUrl(project.getGithubUrl());
        if (readmeContent == null) {
            // 如果获取失败，返回缓存内容（即使过期）
            return cachedReadme != null ? cachedReadme.getReadmeContent() : null;
        }

        // 更新缓存
        updateReadmeCache(project.getId(), readmeContent);

        return readmeContent;
    }

    /**
     * 通过URL获取README
     */
    private String fetchReadmeFromGitHubByUrl(String githubUrl) {
        String[] parts = parseGitHubUrl(githubUrl);
        if (parts == null) {
            return null;
        }
        try {
            return fetchReadmeFromGitHub(parts[0], parts[1]);
        } catch (Exception e) {
            log.error("获取README失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 更新README缓存
     */
    private void updateReadmeCache(Long projectId, String readmeContent) {
        LambdaQueryWrapper<ProjectReadme> queryWrapper = new LambdaQueryWrapper<ProjectReadme>()
                .eq(ProjectReadme::getProjectId, projectId);
        ProjectReadme existingReadme = projectReadmeMapper.selectOne(queryWrapper);

        LocalDateTime now = LocalDateTime.now();

        if (existingReadme != null) {
            LambdaUpdateWrapper<ProjectReadme> updateWrapper = new LambdaUpdateWrapper<ProjectReadme>()
                    .eq(ProjectReadme::getProjectId, projectId)
                    .set(ProjectReadme::getReadmeContent, readmeContent)
                    .set(ProjectReadme::getLastSyncTime, now);
            projectReadmeMapper.update(null, updateWrapper);
            log.info("更新README缓存: projectId={}", projectId);
        } else {
            ProjectReadme readme = new ProjectReadme();
            readme.setProjectId(projectId);
            readme.setReadmeContent(readmeContent);
            readme.setLastSyncTime(now);
            projectReadmeMapper.insert(readme);
            log.info("创建README缓存: projectId={}", projectId);
        }
    }

    /**
     * 同步所有项目的README（由定时任务调用）
     */
    @Transactional
    public void syncAllReadmes() {
        log.info("开始同步所有项目的README...");

        List<Project> projects = projectMapper.selectList(
                new LambdaQueryWrapper<Project>()
                        .eq(Project::getIsShow, 1)
                        .isNotNull(Project::getGithubUrl)
        );

        int successCount = 0;
        int failCount = 0;

        for (Project project : projects) {
            try {
                String readmeContent = fetchReadmeFromGitHubByUrl(project.getGithubUrl());
                if (readmeContent != null) {
                    updateReadmeCache(project.getId(), readmeContent);
                    successCount++;
                } else {
                    failCount++;
                }
                // 避免请求过于频繁
                Thread.sleep(500);
            } catch (Exception e) {
                log.error("同步README失败: projectId={}, error={}", project.getId(), e.getMessage());
                failCount++;
            }
        }

        log.info("README同步完成: 成功={}, 失败={}", successCount, failCount);
    }

}
