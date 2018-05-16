package com.bucg.sso.mapper;

import com.bucg.sso.model.Log;

public interface LogMapper {
    int insert(Log record);

    int insertSelective(Log record);
}