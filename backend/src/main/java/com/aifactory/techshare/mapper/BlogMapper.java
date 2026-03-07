package com.aifactory.techshare.mapper;

import com.aifactory.techshare.entity.Blog;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 博客数据访问层
 *
 * @author AI Factory
 */
@Mapper
public interface BlogMapper extends BaseMapper<Blog> {

}
