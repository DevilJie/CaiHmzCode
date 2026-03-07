package com.aifactory.techshare.mapper;

import com.aifactory.techshare.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户数据访问层
 *
 * @author AI Factory
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
