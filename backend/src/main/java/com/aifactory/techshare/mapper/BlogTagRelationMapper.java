package com.aifactory.techshare.mapper;

import com.aifactory.techshare.entity.BlogTagRelation;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 博客标签关联数据访问层
 *
 * @author AI Factory
 */
@Mapper
public interface BlogTagRelationMapper extends BaseMapper<BlogTagRelation> {

}
