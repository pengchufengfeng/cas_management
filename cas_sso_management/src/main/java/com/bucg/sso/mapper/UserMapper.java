package com.bucg.sso.mapper;

import java.util.List;

import com.bucg.sso.model.User;
import com.github.pagehelper.Page;

public interface UserMapper {
    int deleteByPrimaryKey(Long id);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
    /**
     * 获取所有数据
     * @return
     */
    List<User> findAll();

    /**
     * 分页查询数据
     * @return
     */
    Page<User> findByPage();
    

}