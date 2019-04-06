package com.jingxiang.common.dao;


import org.apache.ibatis.annotations.Mapper;

import com.jingxiang.common.dao.core.CrudDao;
import com.jingxiang.common.entity.User;

@Mapper
public interface UserMapper extends CrudDao<User>{
    User checkExist(String openId);
}
