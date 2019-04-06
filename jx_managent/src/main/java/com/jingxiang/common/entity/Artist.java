package com.jingxiang.common.entity;

import java.util.Date;

import com.jingxiang.common.entity.common.DataEntity;

public class Artist extends DataEntity{
	//姓名
	private String artistName;
	//简介
	private String info;
	//合作时间
	private Date colDate;
	//相关证书
	private String relCetri;
    //授权图片
	private String authPhoto;
	//身份证正面
	private String idz;
	//身份证反面
	private String idf;
	//商品类别
	private  String commClass;
	
	public Artist() {
		// TODO Auto-generated constructor stub
	}

	public String getArtistName() {
		return artistName;
	}

	public void setArtistName(String artistName) {
		this.artistName = artistName;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public Date getColDate() {
		return colDate;
	}

	public void setColDate(Date colDate) {
		this.colDate = colDate;
	}

	public String getRelCetri() {
		return relCetri;
	}

	public void setRelCetri(String relCetri) {
		this.relCetri = relCetri;
	}

	public String getAuthPhoto() {
		return authPhoto;
	}

	public void setAuthPhoto(String authPhoto) {
		this.authPhoto = authPhoto;
	}

	public String getIdz() {
		return idz;
	}

	public void setIdz(String idz) {
		this.idz = idz;
	}

	public String getIdf() {
		return idf;
	}

	public void setIdf(String idf) {
		this.idf = idf;
	}

	public String getCommClass() {
		return commClass;
	}

	public void setCommClass(String commClass) {
		this.commClass = commClass;
	}

}
