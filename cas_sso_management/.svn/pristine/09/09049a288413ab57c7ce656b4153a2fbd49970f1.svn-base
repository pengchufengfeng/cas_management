package com.bucg.sso.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bucg.sso.model.User;
import com.bucg.sso.service.UserService;


@RestController
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("users/{id}")
	User user(@PathVariable("id") Long id){
		return userService.findById(id);
	}
	
	/*@RequestMapping("users")
	List<User> users(){
		return userService.findAll();
	}*/
	
	
	@GetMapping("users")
	List<User> usersBypage(int pageNo, @RequestParam(defaultValue="10") int pageSize ){
		return userService.findByPage(pageNo, pageSize);
	}
	
}
