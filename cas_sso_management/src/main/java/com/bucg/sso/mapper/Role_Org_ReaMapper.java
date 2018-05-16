package com.bucg.sso.mapper;

import com.bucg.sso.model.Role_Org_Rea;

public interface Role_Org_ReaMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Role_Org_Rea record);

    int insertSelective(Role_Org_Rea record);

    Role_Org_Rea selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Role_Org_Rea record);

    int updateByPrimaryKey(Role_Org_Rea record);
}