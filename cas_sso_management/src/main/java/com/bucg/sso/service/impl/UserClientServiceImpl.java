package com.bucg.sso.service.impl;

import java.io.IOException;
import java.io.InputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.bucg.sso.mapper.UserMapper;
import com.bucg.sso.mapper.User_Client_ReaMapper;
import com.bucg.sso.model.Client;
import com.bucg.sso.model.User_Client_Rea;
import com.bucg.sso.service.UserClientService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;


@Service
public class UserClientServiceImpl implements UserClientService {
	@Autowired
	User_Client_ReaMapper ucm;
	@Autowired
	UserMapper um;
	public JSONObject importExcel(InputStream inputStream,String type) {
		Workbook wb=	getWorkBook(inputStream,type);
		Sheet sheet = wb.getSheetAt(0);
		int index=0;
		int count=sheet.getLastRowNum();
		for(int i=1;i<=sheet.getLastRowNum();i++) {
			Row row = sheet.getRow(i);
	 		Cell c0=row.getCell(0);c0.setCellType(Cell.CELL_TYPE_STRING);
			Cell c1=row.getCell(1);c1.setCellType(Cell.CELL_TYPE_STRING);
			Cell c2=row.getCell(2);c2.setCellType(Cell.CELL_TYPE_STRING);
			 String cjid = c0.getStringCellValue();
			 Long userid=um.selectByCjid(cjid).getId();
			 if(userid==null) {	 continue;}
			 Long clientid = Long.parseLong(c1.getStringCellValue());
			 String  identity=row.getCell(2).getStringCellValue();
			 int insert = ucm.insert(new User_Client_Rea(userid, clientid, identity));
			 index=index+insert;
		}
		JSONObject json=new JSONObject();
		json.put("info","共获取"+count+"条，成功"+index+"条");
		return json;
	}
	
	private Workbook getWorkBook(InputStream inputStream,String type) {
		Workbook wb = null;
			 try {
				 if("xls".equalsIgnoreCase(type)) {
				wb = new HSSFWorkbook(inputStream);}
				 else {
					 wb=new XSSFWorkbook(inputStream);
				 }
			} catch (IOException e) {
				e.printStackTrace();
			}
			return wb;
		}

	@Override
	public int edit(User_Client_Rea userclient) {
		// TODO Auto-generated method stub
		
		return ucm.updateByPrimaryKeySelective(userclient);
	}

	@Override
	public Page<User_Client_Rea> findByPage(int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		 PageHelper.startPage(pageNo, pageSize);
	     return ucm.findByPage();
	}

	@Override
	public User_Client_Rea findById(long id) {
		// TODO Auto-generated method stub
		return ucm.selectByPrimaryKey(id);
	}
	
		
}
