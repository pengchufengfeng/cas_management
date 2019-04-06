package com.jingxiang.common.entity;

import com.jingxiang.common.entity.common.DataEntity;

public class Plat extends DataEntity {
	//平台名称
	private String wayName;
	//平台比例
	private String proportion;

	public Plat() {
		// TODO Auto-generated constructor stub
	}

	public String getProportion() {
		return proportion;
	}

	public void setProportion(String proportion) {
		this.proportion = proportion;
	}

	public String getWayName() {
		return wayName;
	}

	public void setWayName(String wayName) {
		this.wayName = wayName;
	}

}
