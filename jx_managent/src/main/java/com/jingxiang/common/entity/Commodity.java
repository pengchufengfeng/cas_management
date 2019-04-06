package com.jingxiang.common.entity;

import com.jingxiang.common.entity.common.DataEntity;

public class Commodity extends DataEntity {
 
	//商品编号
	private String commodityNum;
	//商品名称
	private String commodityName;
	//分类
    private String className;
    //尺寸
    private String commodityScale;
    //艺术家
    private Artist artist;
    //艺术家Id
    private String artistId;
    //工艺
    private String way;
    //产地
    private String palace;
    //泥土
    private String dust;
    //温度
    private String temput;
    //简介
    private String note;
    //图片
    private String photo;
    //商品上架量
    private String commodityStock;
    //商品状态
    private String commodityStatus;
    
	public Commodity() {
		// TODO Auto-generated constructor stub
	}




	public String getCommodityNum() {
		return commodityNum;
	}




	public void setCommodityNum(String commodityNum) {
		this.commodityNum = commodityNum;
	}




	public String getCommodityName() {
		return commodityName;
	}




	public void setCommodityName(String commodityName) {
		this.commodityName = commodityName;
	}




	public String getClassName() {
		return className;
	}




	public void setClassName(String className) {
		this.className = className;
	}




	public String getCommodityScale() {
		return commodityScale;
	}




	public void setCommodityScale(String commodityScale) {
		this.commodityScale = commodityScale;
	}




	

	public String getWay() {
		return way;
	}




	public void setWay(String way) {
		this.way = way;
	}




	public String getPalace() {
		return palace;
	}




	public void setPalace(String palace) {
		this.palace = palace;
	}




	public String getDust() {
		return dust;
	}




	public void setDust(String dust) {
		this.dust = dust;
	}




	public String getTemput() {
		return temput;
	}




	public void setTemput(String temput) {
		this.temput = temput;
	}




	public String getNote() {
		return note;
	}




	public void setNote(String note) {
		this.note = note;
	}




	public String getCommodityStock() {
		return commodityStock;
	}




	public void setCommodityStock(String commodityStock) {
		this.commodityStock = commodityStock;
	}




	public String getCommodityStatus() {
		return commodityStatus;
	}




	public void setCommodityStatus(String commodityStatus) {
		this.commodityStatus = commodityStatus;
	}




	public String getPhoto() {
		return photo;
	}




	public void setPhoto(String photo) {
		this.photo = photo;
	}




	public Artist getArtist() {
		return artist;
	}




	public void setArtist(Artist artist) {
		this.artist = artist;
	}




	public String getArtistId() {
		return artistId;
	}




	public void setArtistId(String artistId) {
		this.artistId = artistId;
	}

}
