package com.bucg.sso.mapper;

import com.bucg.sso.model.Client_Group;

public interface Client_GroupMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Client_Group record);

    int insertSelective(Client_Group record);

    Client_Group selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Client_Group record);

    int updateByPrimaryKey(Client_Group record);
}