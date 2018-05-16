package com.bucg.sso.mapper;

import com.bucg.sso.model.User_Role_Rea;

public interface User_Role_ReaMapper {
    int deleteByPrimaryKey(Long id);

    int insert(User_Role_Rea record);

    int insertSelective(User_Role_Rea record);

    User_Role_Rea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(User_Role_Rea record);

    int updateByPrimaryKey(User_Role_Rea record);
}