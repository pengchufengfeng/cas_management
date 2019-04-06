package com.bucg.sso.mapper;

import org.apache.ibatis.annotations.Param;

import com.bucg.sso.model.Organization;

public interface OrganizationMapper {
    int deleteByPrimaryKey(String  id);

    int insert(Organization record);

    int insertSelective(Organization record);

    Organization selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Organization record);

    int updateByPrimaryKey(Organization record);
    Organization getOrganizationTree(@Param("id")String id);
}