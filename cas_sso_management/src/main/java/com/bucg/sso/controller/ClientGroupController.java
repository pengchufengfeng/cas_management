package com.bucg.sso.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bucg.sso.model.Client_Group;
import com.bucg.sso.service.ClientGroupService;
@RestController
@RequestMapping("/clientgroups")
public class ClientGroupController {

	@Autowired
	private ClientGroupService clientGroupService;

	public ClientGroupController() {
		// TODO Auto-generated constructor stub
	}

	// 按id查找
	@RequestMapping(method = RequestMethod.GET)
	List<Client_Group> findAll(){
		return clientGroupService.findAll();
	}

}
