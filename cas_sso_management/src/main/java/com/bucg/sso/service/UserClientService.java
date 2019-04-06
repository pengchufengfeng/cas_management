package com.bucg.sso.service;

import java.io.InputStream;

import com.alibaba.fastjson.JSONObject;
import com.bucg.sso.model.Client;
import com.bucg.sso.model.User_Client_Rea;
import com.github.pagehelper.Page;

public interface UserClientService {
	 JSONObject importExcel(InputStream inputStream,String type);
	 int edit(User_Client_Rea userclient);
	 Page<User_Client_Rea> findByPage(int pageNo, int pageSize);
	 User_Client_Rea findById(long id);
}
