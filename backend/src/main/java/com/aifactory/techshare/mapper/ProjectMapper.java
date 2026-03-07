package com.aifactory.techshare.mapper;

import com.aifactory.techshare.entity.Project;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 项目数据访问层
 *
 * @author AI Factory
 */
@Mapper
public interface ProjectMapper extends BaseMapper<Project> {

}
