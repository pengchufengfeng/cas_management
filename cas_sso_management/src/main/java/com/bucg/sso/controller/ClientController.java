package com.bucg.sso.controller;

import java.util.Date;
import java.util.List;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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

import com.bucg.sso.model.Client;
import com.bucg.sso.service.ClientService;

@RestController
@RequestMapping("/clients")
public class ClientController {

	
	@Autowired
	private ClientService clientService;
	//@Autowired
	//private ClientMapper m;
	public ClientController() {
		// TODO Auto-generated constructor stub
	}
	//按id查找
	@RequestMapping(value="/{id}",method = RequestMethod.GET)
	 Client findClientById(@PathVariable("id") long id){
		return clientService.findById(id);
	}
	//新增应用
	@PostMapping
    public @ResponseBody int addClient(Client client,HttpServletRequest request) {
		 
		HttpSession session = request.getSession();
		long cjid=(long) session.getAttribute("cjid");
		client.setUserid(cjid);
		Date date=new Date();
		client.setClientGenCtime(date);
		return clientService.addClient(client);
       
    }
	// 修改
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody int editClient( Client client){
		return clientService.editClient(client);
    }
    
    //删除
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody int deleteClient(long id){
  		return clientService.deleteClient(id);
      }
   //分页查询 
    @GetMapping()
    List<Client> clientBypage(@RequestParam(defaultValue="0") int pageNo, @RequestParam(defaultValue="10") int pageSize ){
		return clientService.findByPage(pageNo, pageSize);
	}
  //分页查询 
    @GetMapping("users")
    List<Client> clientBypage2(@Param("clientName")String clientName,@Param("clientgroupid") long clientgroupid,int  pageNo, @RequestParam(defaultValue="10") int pageSize){
		return clientService.findByPage2(clientName,clientgroupid,pageNo, pageSize);
	}
    
  //查询all
  	@RequestMapping(value="/all",method = RequestMethod.GET)
  	 List<Client> findAll(){
  		return clientService.findAll();
  	}
	
}
