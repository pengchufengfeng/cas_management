package com.bucg.sso.model;

import java.util.Date;

public class Role {
	private Long id;

	private Long parentroleid;

	private String roleName;

	private Date genTime;

	private String description;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getParentroleid() {
		return parentroleid;
	}

	public void setParentroleid(Long parentroleid) {
		this.parentroleid = parentroleid;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName == null ? null : roleName.trim();
	}

	

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	public Date getGenTime() {
		return genTime;
	}

	public void setGenTime(Date genTime) {
		this.genTime = genTime;
	}
}