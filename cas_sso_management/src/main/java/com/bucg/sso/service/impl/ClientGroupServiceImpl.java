package com.bucg.sso.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bucg.sso.mapper.Client_GroupMapper;
import com.bucg.sso.model.Client_Group;
import com.bucg.sso.service.ClientGroupService;
@Service
public class ClientGroupServiceImpl implements ClientGroupService  {

	
	@Autowired
	private Client_GroupMapper client_GroupMapper;
	public ClientGroupServiceImpl() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public List<Client_Group> findAll() {
		// TODO Auto-generated method stub
		return client_GroupMapper.findAll();
	}

}
