package com.bucg.sso.model;

import java.util.Date;

public class Client {
    private Long id;

    private Long clientgroupid;

    private String clientName;

    private String clientCode;

    private String clientUrl;

    private String clientType;

    private String clientStatus;

    private long userid;
    private Date clientGenCtime;
    private Client_Group cg;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientgroupid() {
        return clientgroupid;
    }

    public void setClientgroupid(Long clientgroupid) {
        this.clientgroupid = clientgroupid;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName == null ? null : clientName.trim();
    }

    public String getClientCode() {
        return clientCode;
    }

    public void setClientCode(String clientCode) {
        this.clientCode = clientCode == null ? null : clientCode.trim();
    }

    public String getClientUrl() {
        return clientUrl;
    }

    public void setClientUrl(String clientUrl) {
        this.clientUrl = clientUrl == null ? null : clientUrl.trim();
    }

    public String getClientType() {
        return clientType;
    }

    public void setClientType(String clientType) {
        this.clientType = clientType == null ? null : clientType.trim();
    }

    public String getClientStatus() {
        return clientStatus;
    }

    public void setClientStatus(String clientStatus) {
        this.clientStatus = clientStatus == null ? null : clientStatus.trim();
    }

   

    public Date getClientGenCtime() {
        return clientGenCtime;
    }

    public void setClientGenCtime(Date clientGenCtime) {
        this.clientGenCtime = clientGenCtime;
    }

	public Client_Group getCg() {
		return cg;
	}

	public void setCg(Client_Group cg) {
		this.cg = cg;
	}

	public long getUserid() {
		return userid;
	}

	public void setUserid(long userid) {
		this.userid = userid;
	}
}