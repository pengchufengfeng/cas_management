package com.bucg.sso.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bucg.sso.mapper.UserMapper;
import com.bucg.sso.model.User;
import com.bucg.sso.service.UserService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;


@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserMapper userMapper;

	@Override
	public List<User> findAll() {
		return  userMapper.findAll();
	}

	@Override
	public int addUser(User user) {
		return userMapper.insertSelective(user);
	}

	@Override
	public int editUser(User user) {
		return userMapper.updateByPrimaryKeySelective(user);
	}

	@Override
	public Page<User> findByPage(String code,String name,int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		    PageHelper.startPage(pageNo, pageSize);
	        return userMapper.findByPage(code,name);
	}

	@Override
	public User findbynameandpassword(User user) {
		// TODO Auto-generated method stub
		return userMapper.findbynameandpassword(user);
	}

	@Override
	public User findById(long id) {
		// TODO Auto-generated method stub
		return userMapper.selectByPrimaryKey(id);
	}

	
}
