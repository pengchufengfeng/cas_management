package com.bucg.sso.model;

public class User_Client_Rea {
    private Long id;

    private Long userid;

    private Long clientid;

    private String identity;
    
    public User_Client_Rea(Long userid, Long clientid, String identity) {
		super();
		this.userid = userid;
		this.clientid = clientid;
		this.identity = identity;
	}

	public User_Client_Rea() {
		super();
	}

	public User_Client_Rea(Long id, Long userid, Long clientid, String identity) {
		super();
		this.id = id;
		this.userid = userid;
		this.clientid = clientid;
		this.identity = identity;
	}

	public Long getUserid() {
		return userid;
	}

	public void setUserid(Long userid) {
		this.userid = userid;
	}

	public Long getClientid() {
		return clientid;
	}

	public void setClientid(Long clientid) {
		this.clientid = clientid;
	}

	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    
}