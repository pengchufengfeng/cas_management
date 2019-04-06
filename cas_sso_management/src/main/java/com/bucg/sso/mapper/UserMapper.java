package com.bucg.sso.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bucg.sso.model.User;
import com.github.pagehelper.Page;

public interface UserMapper {
    int deleteByPrimaryKey(Long id);
    
    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

	List<User> findAll();
	
	Page<User> findByPage(@Param("orgcode")String orgcode ,@Param("name")String name);
	
	User findbynameandpassword(User user);
	User selectByCjid(@Param("cjid")String cjid);
}