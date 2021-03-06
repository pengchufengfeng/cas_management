package com.bucg.sso.controller;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bucg.sso.model.Client;
import com.bucg.sso.model.User;
import com.bucg.sso.model.bean.ResponseBean;
import com.bucg.sso.service.UserService;
import com.github.pagehelper.Page;



@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping
	public void addUser( User user) {
		userService.addUser(user);
	}
	@PostMapping("/{id}")
	public void updateUser( User user) {
		userService.editUser(user);
	}
	
	//按id查找
		@RequestMapping(value="/{id}",method = RequestMethod.GET)
		 User findUserById(@PathVariable("id") long id){
			return userService.findById(id);
		}
	/*@RequestMapping("users")
	List<User> users(){
		return userService.findAll();
	}*/
	
	@GetMapping
	Page<User> usersBypage(String code,String name,@RequestParam(defaultValue="1")Integer pageNo, @RequestParam(defaultValue="10") int pageSize){
		return userService.findByPage(code,name,pageNo, pageSize);
	}
	
	 @RequestMapping("/login")
	 public ResponseBean login(@Valid User user,BindingResult result,ResponseBean responsebean ,HttpSession session){
		 if(result.hasErrors()){
			return  responsebean.setError(result.getAllErrors().get(0).getDefaultMessage());
	 
	    	}
		User find=userService.findbynameandpassword(user);
		if(find==null){
			responsebean.setError("用户名或者密码错误");
		}else{
			session.setAttribute("cjid", user.getCjid());
			responsebean.setSuccess("登陆成功");
		}
		return responsebean;
		
	 }
}
