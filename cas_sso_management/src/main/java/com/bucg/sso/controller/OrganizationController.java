package com.bucg.sso.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.bucg.sso.service.OrganizationService;

@RestController
@RequestMapping("/organization")
public class OrganizationController {
	@Autowired
	OrganizationService os;
	/**
	 * 
	 * 获取组织树
	 * */
	@GetMapping(produces="application/json; charset=UTF-8")
	 
	public String getOrganizationTree(@RequestParam(defaultValue="0001A1100000000008V7")String id) {
		return  os.getOrgantionTree(id);
		
	}
	
}
