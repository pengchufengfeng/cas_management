package com.bucg.sso.mapper;

import com.bucg.sso.model.User_Client_Rea;

public interface User_Client_ReaMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(User_Client_Rea record);

    int insertSelective(User_Client_Rea record);

    User_Client_Rea selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(User_Client_Rea record);

    int updateByPrimaryKey(User_Client_Rea record);
}