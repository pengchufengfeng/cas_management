package com.bucg.sso.model;

public class Client {
    private Long id;

    private Long clientgroupid;

    private String clientName;

    private String clientCode;

    private String clientUrl;

    private String clientType;

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
}