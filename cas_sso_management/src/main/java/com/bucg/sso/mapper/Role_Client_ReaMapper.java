package com.bucg.sso.mapper;

import com.bucg.sso.model.Role_Client_Rea;

public interface Role_Client_ReaMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Role_Client_Rea record);

    int insertSelective(Role_Client_Rea record);

    Role_Client_Rea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Role_Client_Rea record);

    int updateByPrimaryKey(Role_Client_Rea record);
}