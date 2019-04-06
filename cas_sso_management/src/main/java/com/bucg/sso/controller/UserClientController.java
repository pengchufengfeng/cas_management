package com.bucg.sso.controller;

import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;
import com.bucg.sso.model.Client;
import com.bucg.sso.model.User;
import com.bucg.sso.model.User_Client_Rea;
import com.bucg.sso.service.UserClientService;

@RestController
@RequestMapping("/userclient")
public class UserClientController {
	@Autowired
	UserClientService ucs;
	
	@PostMapping("/excel/import")
	public JSONObject importUserClient( @RequestParam(name="file")MultipartFile file) throws IOException {
		String name=file.getOriginalFilename();
		return ucs.importExcel(file.getInputStream(), FilenameUtils.getExtension(name));
		
	}
	//新增应用
	
	//修改映射
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody int editUserClient( User_Client_Rea userclient){
		return ucs.edit(userclient);
    }
	//按id查找
	@RequestMapping(value="/{id}",method = RequestMethod.GET)
	User_Client_Rea findUserById(@PathVariable("id") long id){
		return ucs.findById(id);
			}
	//分页查询 
    @GetMapping("userclients")
    List<User_Client_Rea> userclientfindbypage(@RequestParam(defaultValue="1")Integer pageNo,@RequestParam(defaultValue="10") int pageSize){
		
    	return ucs.findByPage(pageNo,pageSize);
    	
    }
	
	
	
	
}
