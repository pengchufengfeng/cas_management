package com.bucg.sso.model.bean;

public class UserClientMap {
	private Long id;
	private String cjid;
	private String clientName;
	private String identity;
	private Long clientid;
	public String getCjid() {
		return cjid;
	}
	public void setCjid(String cjid) {
		this.cjid = cjid;
	}
	public String getClientName() {
		return clientName;
	}
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	public Long getClientid() {
		return clientid;
	}
	public void setClientid(Long clientid) {
		this.clientid = clientid;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
}
