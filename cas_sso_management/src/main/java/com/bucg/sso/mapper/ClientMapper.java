package com.bucg.sso.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bucg.sso.model.Client;
import com.github.pagehelper.Page;

public interface ClientMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Client record);

    int insertSelective(Client record);

    Client selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Client record);

    int updateByPrimaryKey(Client record);
    
    List<Client> findAll();
    
    Page<Client> findByPage();
    
    Page<Client> findByPage2(@Param("clientName")String clientName, @Param("clientgroupid") long clientgroupid);
    public  Client getClientById(long id);
}