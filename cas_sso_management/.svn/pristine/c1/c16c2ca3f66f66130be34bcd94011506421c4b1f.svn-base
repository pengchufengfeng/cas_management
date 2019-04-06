package com.bucg.sso.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bucg.sso.mapper.ClientMapper;
import com.bucg.sso.model.Client;
import com.bucg.sso.service.ClientService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
@Service
public class ClientServiceImpl implements ClientService {
 
	@Autowired
	private ClientMapper clientMapper;
	@Autowired
	public ClientServiceImpl() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public Client findById(long id) {
		// TODO Auto-generated method stub
		
		return  clientMapper.getClientById(id);
	}

	@Override
	public List<Client> findAll() {
		// TODO Auto-generated method stub
		return clientMapper.findAll();
	}

	@Override
	public int addClient(Client client) {
		// TODO Auto-generated method stub
		return clientMapper.insertSelective(client);
	}

	@Override
	public int editClient(Client client) {
		// TODO Auto-generated method stub
		return clientMapper.updateByPrimaryKeySelective(client);
	}

	@Override
	public int deleteClient(long id) {
		// TODO Auto-generated method stub
		return clientMapper.deleteByPrimaryKey(id);
	}

	@Override
	public Page<Client> findByPage(int pageNo, int pageSize) {
		
		// TODO Auto-generated method stub
	    PageHelper.startPage(pageNo, pageSize);
	    
	    
		return clientMapper.findByPage();
	}
	
	@Override
	public Page<Client> findByPage2(String clientName, long clientgroupid, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		PageHelper.startPage(pageNo, pageSize);
		return clientMapper.findByPage2(clientName,clientgroupid);
	}
	
	

}
